import Astal from "gi://Astal?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Adw from "gi://Adw"
import { alpha, useStyle, variables as v } from "marble/theme"
import { onCleanup, With } from "gnim"
import app from "#/app"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default function Wallpaper(props: { monitor?: Gdk.Monitor }) {
  const gridStyle = useStyle({
    "background": `var(--marble-wallpaper, ${v.bg})`,
    "background-size": "30px 30px",
    "background-position": "-15px -10px",
    "background-image": [
      `linear-gradient(to right, ${alpha(v.primary, 0.18)} 1px, transparent 1px)`,
      `linear-gradient(to bottom, ${alpha(v.primary, 0.18)} 1px, transparent 1px)`,
    ],
  })

  return (
    <Astal.Window
      $={(self) => onCleanup(() => self.destroy())}
      layer={Astal.Layer.BACKGROUND}
      gdkmonitor={props.monitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      class={useStyle({ background: v.bg })}
      visible
    >
      <Adw.Bin class={gridStyle} $type="overlay">
        <With value={app.bgTexture}>
          {(texture) =>
            texture && (
              <Gtk.Picture
                contentFit={Gtk.ContentFit.COVER}
                paintable={texture}
                class={useStyle({
                  opacity: "var(--marble-wp-opacity, 100)",
                })}
              />
            )
          }
        </With>
      </Adw.Bin>
    </Astal.Window>
  )
}
