import Theme from "marble/service/Theme"
import { css, alpha, calc, type Style, variables as v } from "marble/theme"

export function initCss() {
  void css`
    tooltip {
      background-color: ${v.bg};
      color: ${v.fg};
      margin: ${calc(v.spacing, 7)};
      padding: ${calc(v.padding, 5)} ${calc(v.padding, 7)};
      border-radius: ${calc(v.roundness, 9)};
      border: none;
      box-shadow:
        ${v.shadow.sm},
        inset 0 0 0 ${v.borderWidth} ${v.borderColor};
    }
  `
}

export const dialogStyle: Style = {
  "background-color": v.bg,
  "box-shadow": [v.shadow.lg, `inset 0 0 0 ${v.borderWidth} ${v.borderColor}`],
}

export const widgetStyle: Style = {
  "transition": v.transition,
  "border": v.border,
  "border-radius": calc(v.roundness, 13),
  "background-color": alpha(v.widgetBg, v.widgetOpacity),
}

export const adwaita = new Theme.Stylesheet("Adwaita", {
  icon: {
    dark: "dark-mode",
    light: "light-mode",
  },
})

export const nucharm = new Theme.Stylesheet("Nucharm", {
  script: [
    ...["dialog", "bar", "osd", "popups", "lockscreen"].flatMap((ns) => [
      `hyprctl keyword layerrule 'noanim, marble-${ns}'`,
    ]),
    "hyprctl keyword general:border_size 1",
    "hyprctl keyword general:border_size 1",
    "hyprctl keyword general:gaps_out 16",
    "hyprctl keyword general:gaps_in 8",
    'hyprctl keyword general:col.active_border "rgb(51a4e7)"',
    'hyprctl keyword general:col.inactive_border "rgb(181818)"',
    "hyprctl keyword decoration:rounding 9",
    "hyprctl keyword decoration:shadow:enabled true",
    'tmux set-option -g @main_accent "blue"',
  ],
  icon: {
    dark: "dark-mode",
    light: "light-mode",
  },
  stylesheet: {
    dark: {
      wallpaper: "#0f0f0f",
      bg: "#151516",
      fg: "#cfcfcf",
      primary: "#51a4e7",
      success: "#00d787",
      error: "#e55f86",
    },
    light: {
      wallpaper: "#0f0f0f",
      bg: "#fafafa",
      fg: "#090909",
      primary: "#426ede",
      success: "#009e49",
      error: "#b13558",
    },
  },
})

export const grid = new Theme.Stylesheet("Grid", {
  script: {
    onDark: [
      'hyprctl keyword general:col.active_border "rgb(00c483)"',
      'hyprctl keyword general:col.inactive_border "rgba(1111110f)"',
      "hyprctl keyword decoration:shadow:enabled true",
      'tmux set-option -g @main_accent "green"',
    ],
    onLight: [
      'hyprctl keyword general:col.active_border "rgb(542c35)"',
      'hyprctl keyword general:col.inactive_border "rgba(542c3537)"',
      "hyprctl keyword decoration:shadow:enabled false",
      'tmux set-option -g @main_accent "#7B4B3A"',
    ],
  },
  stylesheet: {
    dark: {
      "wp-opacity": 0,
      "bg": "#0f0f0f",
      "fg": "#cfcfcf",
      "primary": "#00c483",
      "success": "#00d787",
      "error": "#e55f86",
    },
    light: {
      "wp-opacity": 0,
      "border-opacity": 0.18,
      "bg-border-opacity": 0.18,
      "shadow-color": "transparent",
      "wallpaper": "#FBF3D5",
      "bg": "#fafafa",
      "fg": "#542c35",
      "accent-fg": "#eeeeee",
      "primary": "#7B4B3A",
      "success": "#9cebaa",
      "error": "#d62e58",
    },
  },
})
