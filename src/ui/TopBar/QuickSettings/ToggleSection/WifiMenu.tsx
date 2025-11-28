import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import Network from "gi://AstalNetwork"
import {
  MenuRevealer,
  Box,
  Button,
  Icon,
  ScrollView,
  Separator,
  Text,
} from "marble/components"
import { useStyle, variables as v } from "marble/theme"
import { createBinding, createComputed, For, With } from "gnim"
import { gettext as t } from "gettext"

function AccessPoint({ wifi, ap }: { wifi: Network.Wifi; ap: Network.AccessPoint }) {
  const isActive = createBinding(wifi, "activeAccessPoint").as((a) => a === ap)
  const successClass = useStyle({ color: v.success })
  const primaryClass = useStyle({ color: v.primary })
  const errorClass = useStyle({ color: v.error })

  const icon = createBinding(ap, "iconName")
  const ssid = createBinding(ap, "ssid")

  const color = createBinding(ap, "strength").as((s) => {
    if (s > 75) return successClass
    if (s > 50) return primaryClass
    return errorClass
  })

  const bitrate = createBinding(ap, "maxBitrate").as((br) =>
    t(`%d Mbit/s`).replace("%d", `${br / 1000}`),
  )

  const hasPW = createBinding(ap, "requiresPassword")
  const lock = createComputed(() => hasPW() && !isActive())

  // TODO: password popup
  async function activate() {
    ap.activate(null, null)
  }

  return (
    <Button
      visible={ssid((s) => !!s)}
      r={7}
      m={1}
      px={5}
      py={3}
      hfill
      flat
      tooltipText={bitrate}
      onPrimaryClick={activate}
    >
      <Box gap={2}>
        <Icon class={color} icon={icon} />
        <Icon visible={lock} icon="system-lock-screen" />
        <Text
          truncate
          hexpand
          halign={Gtk.Align.START}
          weight={isActive((a) => (a ? "bold" : "normal"))}
        >
          {ssid((s) => s || "")}
        </Text>
        <Icon hexpand halign={Gtk.Align.END} visible={isActive} icon="checkmark" />
      </Box>
    </Button>
  )
}

export default function WifiMenu() {
  const network = Network.get_default()
  const wifi = createBinding(network, "wifi")
  const aps = (wifi: Network.Wifi) =>
    createBinding(wifi, "accessPoints").as((aps) =>
      aps.sort((a, b) => b.strength - a.strength),
    )

  return (
    <Adw.Bin>
      <With value={wifi}>
        {(wifi) => (
          <MenuRevealer id="wifi">
            <Box my={10} vertical>
              <Box gap={2} p={3}>
                <Icon icon="network-wireless" />
                <Text weight="bold">{t("Wifi")}</Text>
              </Box>
              <Separator />
              <ScrollView>
                <Box vertical gap={1}>
                  <For each={aps(wifi)}>
                    {(ap) => <AccessPoint wifi={wifi} ap={ap} />}
                  </For>
                </Box>
              </ScrollView>
            </Box>
          </MenuRevealer>
        )}
      </With>
    </Adw.Bin>
  )
}
