import Adw from "gi://Adw?version=1"
import Gtk from "gi://Gtk?version=4.0"
import Theme from "marble/service/Theme"
import { Box, Button, MenuToggleButton, Icon, Text } from "marble/components"
import { createBinding, With } from "gnim"
import { gettext as t } from "gettext"

function Content(props: { icon?: Icon.Props["icon"]; text?: Text.Props["children"] }) {
  const { icon, text } = props
  const dark = createBinding(Theme.get_default(), "darkMode")

  return (
    <Box gap={3}>
      <Icon size={18} icon={icon ?? "dark-mode"} />
      <Box vertical valign={Gtk.Align.CENTER}>
        <Text
          size={1.1}
          halign={Gtk.Align.START}
          weight={dark((d) => (d ? "bold" : "normal"))}
        >
          {dark((d) => (d ? t("Dark") : t("Light")))}
        </Text>
        {text && (
          <Text halign={Gtk.Align.START} truncate size={0.9} opacity={0.8}>
            {text}
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default function ThemeToggle() {
  const themes = Theme.get_default()
  const list = createBinding(themes, "themes")
  const dark = createBinding(themes, "darkMode")
  const theme = createBinding(themes, "activeTheme")
  const hasThemes = list((l) => l.length > 1)

  return (
    <Adw.Bin>
      <With value={hasThemes}>
        {(has) =>
          has ? (
            <MenuToggleButton
              r={13}
              px={6}
              id="themes"
              active={dark}
              onToggled={(active) => (themes.darkMode = active)}
            >
              <With value={theme}>
                {(theme) =>
                  theme ? (
                    <Content
                      icon={createBinding(theme, "icon")}
                      text={createBinding(theme, "name")}
                    />
                  ) : (
                    <Content />
                  )
                }
              </With>
            </MenuToggleButton>
          ) : (
            <Button
              r={13}
              px={6}
              m={0}
              hfill
              vfill
              active={dark}
              onToggled={(active) => (themes.darkMode = active)}
            >
              <Content />
            </Button>
          )
        }
      </With>
    </Adw.Bin>
  )
}
