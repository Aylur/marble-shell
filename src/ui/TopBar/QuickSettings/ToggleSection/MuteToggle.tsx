import Adw from "gi://Adw?version=1"
import Wp from "gi://AstalWp"
import { MicrophoneIndicator, Box, Button, Text } from "marble/components"
import { createBinding } from "gnim"
import { gettext as t } from "gettext"

export default function MuteToggle() {
  const mic = Wp.get_default()!.get_default_microphone()!
  const mute = createBinding(mic, "mute")

  return (
    <Adw.Bin>
      <Button
        r={13}
        px={6}
        hfill
        vfill
        hexpand
        active={mute}
        onToggled={(active) => mic.set_mute(active)}
      >
        <Box gap={3}>
          <MicrophoneIndicator iconSize={18} alwaysVisible />
          <Text size={1.1} weight={mute((d) => (d ? "bold" : "normal"))}>
            {mute((d) => (d ? t("Muted") : t("Unmuted")))}
          </Text>
        </Box>
      </Button>
    </Adw.Bin>
  )
}
