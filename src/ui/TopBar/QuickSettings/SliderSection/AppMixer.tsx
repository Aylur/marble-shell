import Gtk from "gi://Gtk?version=4.0"
import Wp from "gi://AstalWp"
import { Box, Icon, Separator, Slider, Text } from "marble/components"
import { throttle } from "es-toolkit"
import { createBinding, For } from "gnim"
import { gettext as t } from "gettext"

export default function AppMixer() {
  const audio = Wp.get_default()!.get_audio()!
  const apps = createBinding(audio, "streams")

  return (
    <Box vertical px={3} py={6}>
      <Box gap={2} p={3}>
        <Icon icon="audio-mixer" size={18} />
        <Text weight="bold">{t("Applications")}</Text>
      </Box>
      <Separator />
      <Box vertical>
        <For each={apps}>
          {(app) => (
            <Box p={4} gap={4}>
              <Icon
                size={38}
                icon={createBinding(app, "description").as((s) => s.toLowerCase())}
                tooltipText={createBinding(app, "name")}
                fallback="applications-multimedia"
              />
              <Box vertical gap={2}>
                <Text truncate halign={Gtk.Align.START}>
                  {createBinding(app, "name")}
                </Text>
                <Slider
                  value={createBinding(app, "volume")}
                  onChange={throttle((value: number) => app.set_volume(value), 500)}
                  width={7}
                />
              </Box>
            </Box>
          )}
        </For>
      </Box>
    </Box>
  )
}
