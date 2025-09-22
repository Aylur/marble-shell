import Astal from "gi://Astal?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Adw from "gi://Adw"
import { useStyle, variables as v } from "marble/theme"
import { onCleanup, With } from "gnim"
import app from "#/app"

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

export default function Wallpaper(props: { monitor?: Gdk.Monitor }) {
  return (
    <Astal.Window
      $={(self) => onCleanup(() => self.destroy())}
      layer={Astal.Layer.BACKGROUND}
      gdkmonitor={props.monitor}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      class={useStyle({ "background-color": v.bg })}
      visible
    >
      <Adw.Bin $type="overlay">
        <With value={app.bgTexture}>
          {(texture) =>
            texture && (
              <Gtk.Picture contentFit={Gtk.ContentFit.COVER} paintable={texture} />
            )
          }
        </With>
      </Adw.Bin>
    </Astal.Window>
  )
}
