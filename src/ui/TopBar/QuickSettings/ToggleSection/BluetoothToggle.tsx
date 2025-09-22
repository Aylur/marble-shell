import Gtk from "gi://Gtk?version=4.0"
import Bluetooth from "gi://AstalBluetooth"
import { MenuToggleButton, Box, BluetoothIndicator, Text } from "marble/components"
import { createBinding } from "gnim"
import { gettext as t } from "gettext"

export default function BluetoothToggle() {
  const bt = Bluetooth.get_default()
  const powered = createBinding(bt, "isPowered")

  // FIXME: might not work as expected when multiple items are connected
  const device = createBinding(bt, "isConnected").as(() =>
    bt
      .get_devices()
      .filter((d) => d.connected)
      .at(0),
  )

  return (
    <MenuToggleButton
      id="bluetooth"
      r={13}
      px={6}
      active={powered}
      onToggled={() => bt.toggle()}
    >
      <Box gap={3}>
        <BluetoothIndicator iconSize={18} />
        <Box vertical valign={Gtk.Align.CENTER}>
          <Text
            halign={Gtk.Align.START}
            size={1.1}
            weight={powered((a) => (a ? "bold" : "normal"))}
          >
            {powered((a) => (a ? t("Powered") : t("Disabled")))}
          </Text>
          <Text
            truncate
            halign={Gtk.Align.START}
            size={0.9}
            opacity={0.8}
            visible={device((d) => !!d)}
          >
            {device((d) => d?.name ?? "")}
          </Text>
        </Box>
      </Box>
    </MenuToggleButton>
  )
}
