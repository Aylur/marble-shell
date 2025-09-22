import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import Bluetooth from "gi://AstalBluetooth"
import { createBinding, For } from "gnim"
import { cls, useStyle, variables as v } from "marble/theme"
import {
  ScrollView,
  Button,
  Box,
  Icon,
  Separator,
  Text,
  MenuRevealer,
} from "marble/components"
import { gettext as t } from "gettext"

function Device({ device }: { device: Bluetooth.Device }) {
  const bt = Bluetooth.get_default()
  const activeStyle = useStyle({ color: v.primary })
  const connected = createBinding(device, "connected")
  const connecting = createBinding(device, "connecting")
  const icon = createBinding(device, "icon")
  const alias = createBinding(device, "alias")

  function onClicked() {
    bt.get_adapter()?.set_powered(true)
    if (!device.connecting && !device.connected) {
      device.connect_device(null)
    } else {
      device.disconnect_device(null)
    }
  }

  return (
    <Button r={7} m={1} px={5} py={3} hfill flat onPrimaryClick={onClicked}>
      <Box gap={3}>
        <Icon class={cls(connected((c) => c && activeStyle))} icon={icon} size={18} />
        <Text weight={connected((c) => (c ? "bold" : "normal"))}>{alias}</Text>
        <Gtk.Revealer
          hexpand
          halign={Gtk.Align.END}
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          revealChild={connected}
        >
          <Text opacity={0.7}>{t("Connected")}</Text>
        </Gtk.Revealer>
        <Gtk.Revealer
          transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
          revealChild={connecting}
        >
          <Adw.Spinner />
        </Gtk.Revealer>
      </Box>
    </Button>
  )
}

export default function BluetoothMenu() {
  const devices = createBinding(Bluetooth.get_default(), "devices")

  return (
    <MenuRevealer id="bluetooth">
      <Box my={10} vertical>
        <Box gap={2} p={3}>
          <Icon icon="bluetooth" size={18} />
          <Text weight="bold">{t("Bluetooth")}</Text>
        </Box>
        <Separator />
        <ScrollView>
          <Box vertical gap={1}>
            <For each={devices}>{(device) => <Device device={device} />}</For>
          </Box>
        </ScrollView>
      </Box>
    </MenuRevealer>
  )
}
