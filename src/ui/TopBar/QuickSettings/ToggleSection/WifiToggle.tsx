import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import Network from "gi://AstalNetwork"
import { Box, Icon, Text, MenuToggleButton } from "marble/components"
import { createBinding, With } from "gnim"
import { gettext as t } from "gettext"

export default function WifiToggle() {
  const network = Network.get_default()
  const wifi = createBinding(network, "wifi")

  return (
    <Adw.Bin visible={wifi((w) => !!w)}>
      <With value={wifi}>
        {(wifi) => {
          const enabled = createBinding(wifi, "enabled")
          const icon = createBinding(wifi, "iconName")
          const ssid = createBinding(wifi, "ssid")

          return (
            <MenuToggleButton
              px={6}
              id="wifi"
              active={enabled}
              onToggled={(active) => wifi.set_enabled(active)}
            >
              <Box gap={3}>
                <Icon size={18} icon={icon} />
                <Box vertical valign={Gtk.Align.CENTER}>
                  <Text
                    truncate
                    halign={Gtk.Align.START}
                    size={1.1}
                    weight={enabled((e) => (e ? "bold" : "normal"))}
                  >
                    {enabled((e) => (e ? t("Enabled") : t("Disabled")))}
                  </Text>
                  <Text
                    truncate
                    halign={Gtk.Align.START}
                    visible={ssid((s) => !!s)}
                    size={0.9}
                    opacity={0.8}
                  >
                    {ssid((s) => s || "")}
                  </Text>
                </Box>
              </Box>
            </MenuToggleButton>
          )
        }}
      </With>
    </Adw.Bin>
  )
}
