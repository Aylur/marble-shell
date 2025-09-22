import Gio from "gi://Gio?version=2.0"
import Gdk from "gi://Gdk?version=4.0"
import GLib from "gi://GLib?version=2.0"
import { version } from "../package.json"
import { gtype, property, register } from "gnim/gobject"
import { createTexture } from "marble/components"
import { App as MarbleApp } from "marble/app"
import { Gnofi } from "gnofi"
import { gettext as t } from "gettext"

export type SystemAction = "poweroff" | "logout" | "reboot" | null

@register({ GTypeName: "App" })
class App extends MarbleApp {
  gnofi = new Gnofi({ keys: Gdk })

  isHyprland =
    !!GLib.getenv("XDG_CURRENT_DESKTOP")?.split(":").includes("Hyprland") ||
    !!GLib.getenv("HYPRLAND_INSTANCE_SIGNATURE")

  hasNix = GLib.find_program_in_path("nix")

  bgTexture = createTexture(
    Gio.File.new_for_path(`${GLib.get_user_config_dir()}/background`),
  )

  pkgdatadir = import.meta.PKG_DATADIR || SRC + "/data"

  @property(Boolean)
  lockscreenOpen: boolean = false

  @property(gtype<SystemAction>(String))
  powerDialog: SystemAction = null
}

const app = new App({
  version,
  applicationId: "dev.Aylur.MarbleShell",
  applicationName: t("Marble Shell"),
  programName: "marble",
})

export default app
