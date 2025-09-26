import Mpris from "gi://AstalMpris"
import Gtk from "gi://Gtk?version=4.0"
import {
  Box,
  Icon,
  MprisArtist,
  MprisBrandIcon,
  MprisCoverArt,
  MprisLengthLabel,
  MprisList,
  MprisNextButton,
  MprisPlayPauseButton,
  MprisPlayStatusIcon,
  MprisPositionLabel,
  MprisPositionSlider,
  MprisPrevButton,
  MprisRaiseButton,
  MprisTitle,
} from "marble/components"
import { cls, useStyle, variables as v } from "marble/theme"
import { widgetStyle } from "#/theme"
import { createBinding } from "gnim"

function MediaPlayer({ coverSize = 100 }) {
  const image = useStyle({
    "box-shadow": [v.shadow.md, `inset 0 0 0 ${v.borderWidth} ${v.borderColor}`],
  })

  return (
    <Box gap={6} p={3}>
      <MprisCoverArt valign="start" class={image} size={coverSize} r={13} />
      <Box vertical>
        <Box vexpand>
          <Box vertical hexpand>
            <MprisTitle size={1.1} weight="bold" xalign={0} hexpand wrap />
            <MprisArtist xalign={0} hexpand wrap />
          </Box>
          <MprisRaiseButton flat p={3} r={11} vexpand valign="start">
            <MprisBrandIcon size={18} />
          </MprisRaiseButton>
        </Box>
        <MprisPositionSlider width={6} />
        <Gtk.CenterBox>
          <MprisPositionLabel $type="start" />
          <Box $type="center" mt={3}>
            <MprisPrevButton flat p={5} r={9}>
              <Icon icon="media-skip-backward" size={15} />
            </MprisPrevButton>
            <MprisPlayPauseButton flat p={5} mx={5} r={9}>
              <MprisPlayStatusIcon size={18} />
            </MprisPlayPauseButton>
            <MprisNextButton flat p={5} r={9}>
              <Icon icon="media-skip-forward" size={15} />
            </MprisNextButton>
          </Box>
          <MprisLengthLabel $type="end" />
        </Gtk.CenterBox>
      </Box>
    </Box>
  )
}

export default function MediaSection(
  props: Omit<Box.Props, "children" | "vertical" | "visible"> & { flat?: boolean },
) {
  const { flat, ...rest } = props
  const style = useStyle(widgetStyle)
  const list = createBinding(Mpris.get_default(), "players")

  return (
    <Box vertical visible={list((l) => l.length > 0)} {...rest}>
      <MprisList>
        {() => (
          <Box class={cls(!flat && style)}>
            <MediaPlayer />
          </Box>
        )}
      </MprisList>
    </Box>
  )
}
