import Theme from "marble/service/Theme"
import { css, alpha, calc, type Style, variables as v } from "marble/theme"

export function initCss() {
  void css`
    tooltip {
      background-color: ${v.bg};
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
  ],
  icon: {
    dark: "dark-mode",
    light: "light-mode",
  },
  stylesheet: {
    dark: {
      bg: "#151516",
      fg: "#cfcfcf",
      primary: "#51a4e7",
      success: "#00d787",
      error: "#e55f86",
    },
    light: {
      bg: "#fafafa",
      fg: "#090909",
      primary: "#426ede",
      success: "#009e49",
      error: "#b13558",
    },
  },
})
