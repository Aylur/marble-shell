import * as Gnofi from "gnofi"
import GLib from "gi://GLib?version=2.0"
import Tasks from "marble/service/Tasks"
import { createContext, jsx, This } from "gnim"
import { gettext as t } from "gettext"
import app from "./app"

const GnofiContext = createContext<ReturnType<typeof createPickers> | null>(null)

export function useGnofi() {
  const ctx = GnofiContext.use()
  if (!ctx) throw Error("missing GnofiProvider")
  return ctx
}

export function GnofiProvider<T>(fn: () => T) {
  const ctx = createPickers()
  return GnofiContext.provide(ctx, fn)
}

function createPickers() {
  const { gnofi } = app
  const tasks = Tasks.get_default()

  let appPicker: Gnofi.AppPicker
  let dockPicker: Gnofi.Picker<string>
  let nixPicker: Gnofi.NixPicker
  let wpPicker: Gnofi.WallpaparPicker
  let calendarPicker: Gnofi.Picker<unknown>
  let hyprlandClientsPicker: Gnofi.Picker<unknown>
  let tasksPicker: Gnofi.Picker<unknown>
  let softwarePicker: Gnofi.SearchPicker
  let filesPicker: Gnofi.SearchPicker
  let calcPicker: Gnofi.SearchPicker

  // builtin
  gnofi.builtinHelpPicker.showAll = true
  gnofi.builtinDefaultPicker.connect("activate", () => gnofi.close())

  jsx(This, {
    this: gnofi,
    children: [
      (appPicker = jsx(Gnofi.AppPicker, {
        $type: "default-only",
        command: "app",
      })),
      (dockPicker = jsx(Gnofi.Picker<string>, {
        command: "dock",
        hint: t("Type ':' for list of commands"),
        $: (self) => {
          const setResults: (this: Gnofi.Picker<string>) => void = function () {
            this.result = [
              "firefox",
              "ghostty",
              "org.gnome.Nautilus",
              "fragments",
              "spotify",
            ]
          }
          setResults.call(self)
        },
      })),
      app.hasNix &&
        (nixPicker = jsx(Gnofi.NixPicker, {
          command: "nx",
          icon: "folder-nix",
          description: t("Run executables from nixpkgs"),
          onActivate: () => gnofi.close(),
        })),
      app.isHyprland &&
        (hyprlandClientsPicker = jsx(Gnofi.Picker, {
          command: "w",
          icon: "view-grid",
          description: t("List of Hyprland clients"),
          onActivate: () => gnofi.close(),
        })),
      (wpPicker = jsx(Gnofi.WallpaparPicker, {
        command: "wp",
        lookupDirectory: `${GLib.get_home_dir()}/Pictures/Wallpapers`,
        description: t("Change the wallpaper"),
        onFilter: (_, file) => !file.get_basename()?.endsWith(".svg"),
        onActivate: () => gnofi.close(),
      })),
      (calendarPicker = jsx(Gnofi.Picker, {
        command: "cal",
        icon: "x-office-calendar",
        description: t("Calendar"),
      })),
      (tasksPicker = jsx(Gnofi.Picker, {
        command: "t",
        icon: "view-list-bullet",
        description: t("Tasks"),
        hint: t("Add new task"),
        onActivate: (_, text) => {
          tasks.defaultTaskList?.createTask({ summary: text })
        },
        $: (self) => {
          tasks.connect("notify::tasks", () => {
            if (gnofi.activePicker === self) {
              gnofi.focus("entry")
            }
          })
        },
      })),
      (filesPicker = jsx(Gnofi.SearchPicker, {
        $type: "default",
        command: "f",
        maxItems: 6,
        icon: "org.gnome.Nautilus",
        description: t("Search files using Nautilus"),
        onActivate: () => gnofi.close(),
        provider: {
          busName: "org.gnome.Nautilus",
          objectPath: "/org/gnome/Nautilus/SearchProvider",
          desktopId: "org.gnome.Nautilus.desktop",
        },
      })),
      (softwarePicker = jsx(Gnofi.SearchPicker, {
        $type: "default",
        command: "f",
        maxItems: 6,
        icon: "org.gnome.Software",
        description: t("Search software using Gnome Software"),
        onActivate: () => gnofi.close(),
        provider: {
          busName: "org.gnome.Software",
          objectPath: "/org/gnome/Software/SearchProvider",
          desktopId: "org.gnome.Software.desktop",
        },
      })),
      (calcPicker = jsx(Gnofi.SearchPicker, {
        $type: "default",
        command: "c",
        maxItems: 6,
        icon: "org.gnome.Calculator",
        description: t("Calculator"),
        onActivate: () => gnofi.close(),
        provider: {
          busName: "org.gnome.Calculator.SearchProvider",
          objectPath: "/org/gnome/Calculator/SearchProvider",
          desktopId: "org.gnome.Calculator.desktop",
        },
      })),
    ],
  })

  return {
    gnofi,
    appPicker,
    dockPicker,
    nixPicker: nixPicker!,
    hyprlandClientsPicker: hyprlandClientsPicker!,
    wpPicker,
    calendarPicker,
    tasksPicker,
    softwarePicker,
    filesPicker,
    calcPicker,
  }
}
