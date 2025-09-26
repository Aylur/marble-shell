import GioUnix from "gi://GioUnix"
import Gtk from "gi://Gtk?version=4.0"
import { Box, Button, Icon, Text } from "marble/components"
import { useGnofi } from "#/gnofi"

export default function AppButton(props: {
  app: GioUnix.DesktopAppInfo
  label?: boolean
  symbolic?: boolean
}) {
  const { app, label } = props
  const { gnofi } = useGnofi()
  const icon = app.get_icon()?.to_string() || "application-x-executable"
  const name = app.get_name()

  function onClick() {
    app.launch([], null)
    gnofi.close()
  }

  return (
    <Button tooltipText={name} flat focusable hfill m={4} r={11} onPrimaryClick={onClick}>
      <Box
        vertical
        gap={2}
        p={2}
        hexpand
        halign={Gtk.Align.CENTER}
        widthRequest={90}
        heightRequest={90}
      >
        <Icon
          vexpand={!label}
          valign={Gtk.Align.CENTER}
          icon={icon}
          size={76}
          colored={!props.symbolic}
        />
        {label && (
          <Text truncate halign={Gtk.Align.CENTER} weight="bold" size={1.1}>
            {name}
          </Text>
        )}
      </Box>
    </Button>
  )
}
