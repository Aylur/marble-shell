import {
  BatteryIndicator,
  BatteryLabel,
  UptimeLabel,
  Avatar,
  Box,
  Button,
  Icon,
} from "marble/components"
import GLib from "gi://GLib?version=2.0"
import Gtk from "gi://Gtk?version=4.0"
import { useStyle, variables as v } from "marble/theme"
import app from "#/app"

export default function HeaderSection(
  props: Omit<Box.Props, "children" | "vertical"> & { avatarSize?: number },
) {
  return (
    <Box {...props}>
      <Avatar
        r={99}
        size={props.avatarSize ?? 74}
        class={useStyle({ border: v.border })}
        fallbackIcon="folder-user"
        filePath={`/var/lib/AccountsService/icons/${GLib.get_user_name()}`}
      />
      <Box ml={4} gap={4} vertical valign={Gtk.Align.CENTER}>
        <Box gap={2}>
          <BatteryIndicator />
          <BatteryLabel />
        </Box>
        <Box gap={2}>
          <Icon icon="hourglass" />
          <UptimeLabel />
        </Box>
      </Box>
      <Box hexpand halign={Gtk.Align.END} gap={5}>
        <Button p={5} r={15} m={1} onPrimaryClick={() => (app.lockscreenOpen = true)}>
          <Icon size={24} icon="system-lock-screen" />
        </Button>
        <Button p={5} r={15} m={1} onPrimaryClick={() => (app.powerDialog = "logout")}>
          <Icon size={24} icon="system-log-out" />
        </Button>
        <Button p={5} r={15} m={1} onPrimaryClick={() => (app.powerDialog = "logout")}>
          <Icon size={24} icon="system-shutdown" />
        </Button>
      </Box>
    </Box>
  )
}
