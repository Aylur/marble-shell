import Gtk from "gi://Gtk?version=4.0"
import Wp from "gi://AstalWp"
import { Box, Icon, Separator, Text, Button } from "marble/components"
import { createBinding, For } from "gnim"
import { useStyle, variables as v } from "marble/theme"
import { gettext as t } from "gettext"

function Endpoint({ endpoint }: { endpoint: Wp.Endpoint }) {
  const icon = createBinding(endpoint, "icon")
  const isDefault = createBinding(endpoint, "isDefault")
  const description = createBinding(endpoint, "description")
  const activeStyle = useStyle({ color: v.primary })!

  return (
    <Button
      flat
      hfill
      visible={description((d) => !!d)}
      r={7}
      px={5}
      py={3}
      onPrimaryClick={() => endpoint.set_is_default(true)}
    >
      <Box gap={3}>
        <Icon
          class={isDefault((v) => (v ? activeStyle : ""))}
          icon={icon}
          fallback="audio-speakers"
        />
        <Text truncate weight={isDefault((d) => (d ? "bold" : "normal"))}>
          {description((n) => n || t("Unknown"))}
        </Text>
        <Icon
          class={isDefault((v) => (v ? activeStyle : ""))}
          hexpand
          halign={Gtk.Align.END}
          visible={isDefault}
          icon="checkmark"
        />
      </Box>
    </Button>
  )
}

export default function SinkSelector() {
  const audio = Wp.get_default()!.get_audio()!
  const speakers = createBinding(audio, "speakers")

  return (
    <Box vertical px={3} py={6}>
      <Box gap={2} p={3}>
        <Icon icon="audio-speakers" size={18} />
        <Text weight="bold">{t("Outputs")}</Text>
      </Box>
      <Separator />
      <Box vertical gap={1} py={1}>
        <For each={speakers}>{(speaker) => <Endpoint endpoint={speaker} />}</For>
      </Box>
    </Box>
  )
}
