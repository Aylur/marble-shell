import Gtk from "gi://Gtk?version=4.0"
import Wp from "gi://AstalWp"
import Brightness from "marble/service/Brightness"
import { createBinding } from "gnim"
import AppMixer from "./AppMixer"
import SinkSelector from "./SinkSelector"
import {
  Box,
  Button,
  Icon,
  SpeakerSlider,
  BrightnessSlider,
  SinkTypeIndicator,
  MenuArrowButton,
  MenuRevealer,
  MicSlider,
} from "marble/components"

export default function SlidersSection(props: Omit<Box.Props, "vertical" | "children">) {
  const audio = Wp.get_default()!.get_audio()!
  const brightness = Brightness.get_default()
  const mic = Wp.get_default()!.get_default_microphone()!
  const speaker = Wp.get_default()!.get_default_speaker()!
  const showMic = createBinding(audio, "recorders").as(({ length }) => length > 0)
  const showSinks = createBinding(audio, "speakers").as(({ length }) => length > 1)
  const showApps = createBinding(audio, "streams").as(({ length }) => length > 0)

  function toggleMic() {
    mic.mute = !mic.mute
  }

  function toggleMute() {
    speaker.mute = !speaker.mute
  }

  function toggleScreen() {
    brightness.screen = brightness.screen > 0.5 ? 0 : 1
  }

  return (
    <Box vertical {...props}>
      <Box>
        <Button flat mr={3} p={3} r={13} onPrimaryClick={toggleMute}>
          <SinkTypeIndicator valign={Gtk.Align.CENTER} />
        </Button>
        <SpeakerSlider valign={Gtk.Align.CENTER} color="primary" width={9} />
        <MenuArrowButton
          id="sink-selector"
          visible={showSinks}
          iconSize={13}
          ml={5}
          p={3}
          r={11}
        />
        <MenuArrowButton
          id="app-volume"
          visible={showApps}
          iconSize={13}
          ml={5}
          p={3}
          r={11}
        />
      </Box>
      <MenuRevealer id="sink-selector">
        <SinkSelector />
      </MenuRevealer>
      <MenuRevealer id="app-volume">
        <AppMixer />
      </MenuRevealer>
      <Box visible={showMic}>
        <Button flat mr={3} p={3} r={13} onPrimaryClick={toggleMic}>
          <Icon icon="audio-input-microphone" />
        </Button>
        <MicSlider valign={Gtk.Align.CENTER} color="primary" width={9} />
      </Box>
      {brightness.hasScreen && (
        <Box>
          <Button flat mr={3} p={3} r={13} onPrimaryClick={toggleScreen}>
            <Icon icon="display-brightness" />
          </Button>
          <BrightnessSlider valign={Gtk.Align.CENTER} color="primary" width={9} />
        </Box>
      )}
    </Box>
  )
}
