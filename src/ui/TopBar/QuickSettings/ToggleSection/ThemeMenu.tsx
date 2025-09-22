import Theme from "marble/service/Theme"
import { Box, Button, Icon, Separator, Text, MenuRevealer } from "marble/components"
import { cls, useStyle, variables as v } from "marble/theme"
import { createBinding, For } from "gnim"
import { gettext as t } from "gettext"

function ThemeButton({ theme }: { theme: Theme.Stylesheet }) {
  const themes = Theme.get_default()
  const activeStyle = useStyle({ color: v.primary })
  const isActive = createBinding(themes, "activeTheme").as((a) => a === theme)
  const icon = createBinding(theme, "icon")
  const name = createBinding(theme, "name")

  return (
    <Button r={7} m={1} px={5} py={3} hfill flat onPrimaryClick={() => theme.activate()}>
      <Box gap={3}>
        <Icon class={cls(isActive((c) => c && activeStyle))} icon={icon} size={18} />
        <Text weight={isActive((c) => (c ? "bold" : "normal"))}>{name}</Text>
        <Icon class={activeStyle} icon="checkmark" visible={isActive} />
      </Box>
    </Button>
  )
}

export default function ThemeMenu() {
  const themes = Theme.get_default()
  const list = createBinding(themes, "themes")

  return (
    <MenuRevealer id="themes">
      <Box my={10} vertical>
        <Box gap={2} p={3}>
          <Icon icon="preferences-desktop-theme" size={18} />
          <Text weight="bold">{t("Themes")}</Text>
        </Box>
        <Separator />
        <Box vertical gap={1}>
          <For each={list}>{(theme) => <ThemeButton theme={theme} />}</For>
        </Box>
      </Box>
    </MenuRevealer>
  )
}
