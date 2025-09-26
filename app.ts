import Gtk from "gi://Gtk?version=4.0"
import { ForMonitors, ScreenCorners, OSD } from "marble/components"
import Screenlock from "#/ui/Screenlock"
import PowerDialog from "#/ui/PowerDialog"
import NotificationPopups from "#/ui/NotificationPopups"
import TopBar from "#/ui/TopBar"
import Wallpaper from "#/ui/Wallpaper"
import Launcher from "#/ui/Launcher"
import { nucharm, adwaita, grid, initCss } from "#/theme"
import { GnofiProvider } from "#/gnofi"
import { findProviders } from "gnofi"
import { gettext as t } from "gettext"
import app from "#/app"

app.start({
  themes: [nucharm, adwaita, grid],
  icons: `${app.pkgdatadir}/icons`,
  commands: {
    "quit": {
      description: " ".repeat(12) + t("Quit Marble"),
      fn: async () => void setTimeout(() => app.quit(0)),
    },
    "inspect": {
      description: " ".repeat(9) + t("Open Gtk Debug tool"),
      fn: async () => void Gtk.Window.set_interactive_debugging(true),
    },
    "lockscreen": {
      description: " ".repeat(6) + t("Lockscreen"),
      fn: async () => void (app.lockscreenOpen = true),
    },
    "poweroff": {
      description: " ".repeat(8) + t("Open power off dialog"),
      fn: async () => void (app.powerDialog = "poweroff"),
    },
    "launcher": {
      description: " ".repeat(8) + t("Open Launcher"),
      fn: async (cmd) => void app.gnofi.open(cmd ? `:${cmd} ` : ""),
    },
    "list-providers": {
      description: " ".repeat(2) + t("List available SearchProviders"),
      fn: async () => JSON.stringify(findProviders()),
    },
  },
  main() {
    nucharm.activate()
    initCss()
    GnofiProvider(() => {
      Launcher()
      Screenlock()
      ForMonitors((monitor) => {
        PowerDialog({ monitor })
        NotificationPopups({ monitor, width: 400 })
        TopBar({ monitor })
        Wallpaper({ monitor })
        OSD({
          monitor,
          vertical: true,
          halign: "end",
          valign: "center",
        })
        ScreenCorners({
          monitor,
          color: "black",
          overlay: true,
          radius: 17,
        })
      })
    })
  },
})
