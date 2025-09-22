import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import { Text, Box, Lockscreen, ClockLabel } from "marble/components"
import { calc, useStyle, variables as v } from "marble/theme"
import { createBinding, onMount, With } from "gnim"
import { gettext as t } from "gettext"
import app from "#/app"

export default function Screenlock() {
  const clockStyle = useStyle({
    "text-shadow": `3px 4px 12px ${v.shadowColor}`,
  })

  const textEntry = useStyle({
    "background-color": v.bg,
    "box-shadow": [v.shadow.lg, `inset 0 0 0 ${v.borderWidth} ${v.borderColor}`],
    "border-radius": calc(v.roundness, 11),
    "&": {
      " entry": {
        "all": "unset",
        "padding-right": calc(v.padding, 11),
      },
      " text": {
        "padding": calc(v.padding, 11),
        "padding-right": "0",
      },
    },
  })

  const open = createBinding(app, "lockscreenOpen")

  return (
    <Lockscreen open={open} onUnlock={() => (app.lockscreenOpen = false)}>
      {({ loading, error, unlock }) => (
        <>
          <Adw.Bin $type="overlay">
            <With value={app.bgTexture}>
              {(texture) =>
                texture && (
                  <Gtk.Picture contentFit={Gtk.ContentFit.COVER} paintable={texture} />
                )
              }
            </With>
          </Adw.Bin>
          <Box
            $type="overlay"
            hexpand
            vexpand
            halign="center"
            valign="start"
            class={clockStyle}
          >
            <ClockLabel mt={120} weight="bold" size={7.4} format="%H:%M" />
          </Box>
          <Box
            $type="overlay"
            class={textEntry}
            vertical
            hexpand
            vexpand
            halign="center"
            valign="center"
          >
            <Box>
              <Gtk.PasswordEntry
                $={(self) => onMount(() => self.grab_focus())}
                showPeekIcon
                onActivate={({ text }) => unlock(text)}
              />
              <Gtk.Revealer
                revealChild={loading}
                transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
              >
                <Box pr={11} valign="center">
                  <Adw.Spinner visible={loading} />
                </Box>
              </Gtk.Revealer>
            </Box>
            <Gtk.Revealer
              revealChild={error}
              transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            >
              <Box px={7} pb={7} halign="center">
                <Text halign="center" color={v.error}>
                  {t("Authentication Failed")}
                </Text>
              </Box>
            </Gtk.Revealer>
          </Box>
        </>
      )}
    </Lockscreen>
  )
}
