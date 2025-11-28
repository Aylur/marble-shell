import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Adw from "gi://Adw?version=1"
import { Box, Button, Modal, Text } from "marble/components"
import { execAsync } from "ags/process"
import { createBinding, createEffect } from "gnim"
import { gettext as t } from "gettext"
import { useStyle } from "marble/theme"
import { dialogStyle } from "#/theme"
import app from "#/app"

export type SystemAction = "poweroff" | "logout" | "reboot"

export default function PowerDialog(props: { monitor?: Gdk.Monitor }) {
  let btn: Gtk.Widget

  const action = createBinding(app, "powerDialog")

  const title = action((action) => {
    switch (action) {
      case "poweroff":
        return t("Power Off")
      case "logout":
        return t("Log Out")
      case "reboot":
        return t("Reboot")
      default:
        return ""
    }
  })

  const subtitle = action((action) => {
    switch (action) {
      case "poweroff":
        return t("Are you sure you want to shutdown?")
      case "logout":
        return t("Are you sure you want to log out?")
      case "reboot":
        return t("Are you sure you want to reboot?")
      default:
        return ""
    }
  })

  const command = action((action) => {
    switch (action) {
      case "poweroff":
        return "systemctl poweroff"
      case "logout":
        return 'bash -c "loginctl terminate-user $(whoami)"'
      case "reboot":
        return "systemctl reboot"
    }
  })

  function onYes() {
    const cmd = command.peek()
    if (cmd) execAsync(cmd)
  }

  createEffect(() => {
    if (action()) {
      btn.grab_focus()
    }
  })

  return (
    <Modal
      shade
      open={action((a) => a !== null)}
      onClose={() => (app.powerDialog = null)}
      monitor={props.monitor}
    >
      <Adw.Clamp maximumSize={340} widthRequest={340}>
        <Box vertical p={15} r={24} class={useStyle(dialogStyle)}>
          <Text halign="center" weight="bolder" size={1.8}>
            {title}
          </Text>
          <Text mt={6} mb={14} halign="center" truncate opacity={0.8}>
            {subtitle}
          </Text>
          <Box homogeneous gap={12}>
            <Button
              $={(self) => (btn = self)}
              focusable
              hfill
              p={6}
              r={11}
              onPrimaryClick={() => (app.powerDialog = null)}
            >
              <Text hexpand halign="center">
                {t("No")}
              </Text>
            </Button>
            <Button focusable hfill p={6} r={11} color="error" onPrimaryClick={onYes}>
              <Text hexpand halign="center">
                {t("Yes")}
              </Text>
            </Button>
          </Box>
        </Box>
      </Adw.Clamp>
    </Modal>
  )
}
