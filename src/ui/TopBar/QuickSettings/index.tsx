import Adw from "gi://Adw?version=1"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Notifd from "gi://AstalNotifd"
import { Box, Modal, MenuContext } from "marble/components"
import HeaderSection from "./HeaderSection"
import MediaSection from "./MediaSection"
import NotificationSection from "./NotificationSection"
import SlidersSection from "./SliderSection"
import ToggleSection from "./ToggleSection"
import { createBinding, createState, State } from "gnim"
import { dialogStyle } from "#/theme"
import { alpha, useStyle, variables as v } from "marble/theme"

export default function QuickSettings(props: {
  open: State<boolean>
  monitor?: Gdk.Monitor
}) {
  const [quickSettingsOpen, setQuickSettingsOpen] = props.open
  const [menu, setMenu] = createState<string | null>(null)
  const ns = createBinding(Notifd.get_default(), "notifications")

  return (
    <Modal
      monitor={props.monitor}
      open={quickSettingsOpen}
      onClose={() => {
        setQuickSettingsOpen(false)
        setMenu(null)
      }}
      halign={Gtk.Align.END}
      valign={Gtk.Align.START}
      my={34}
      mx={8}
    >
      <Adw.Clamp maximumSize={360}>
        <MenuContext value={[menu, setMenu]}>
          {() => (
            <Box vertical>
              <Box
                vertical
                widthRequest={360}
                r={28}
                class={useStyle(dialogStyle)}
                overflowHidden
              >
                <ToggleSection gap={8} mt={15} px={15} />
                <SlidersSection m={15} />
                <MediaSection gap={2} mb={15} mx={15} flat />
                <HeaderSection
                  avatarSize={58}
                  p={15}
                  pr={20}
                  class={useStyle({
                    "background-color": alpha(v.widgetBg, v.widgetOpacity),
                    "border-top": v.border,
                  })}
                />
              </Box>
              <Box
                visible={ns((ns) => ns.length > 0)}
                widthRequest={360}
                mt={8}
                r={28}
                class={useStyle(dialogStyle)}
                overflowHidden
              >
                <NotificationSection p={15} bg={alpha(v.widgetBg, v.widgetOpacity)} />
              </Box>
            </Box>
          )}
        </MenuContext>
      </Adw.Clamp>
    </Modal>
  )
}
