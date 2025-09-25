import PowerProfiles from "gi://AstalPowerProfiles"
import { Box, Text, MenuToggleButton, PowerProfilesIndicator } from "marble/components"
import { createBinding } from "gnim"
import { gettext as t } from "gettext"

export default function PowerProfilesToggle() {
  const pp = PowerProfiles.get_default()
  const profile = createBinding(pp, "activeProfile")
  const active = profile((p) => p !== "balanced")

  const text = profile((p) => {
    switch (p) {
      case "balanced":
        return t("Balanced")
      case "power-saver":
        return t("Power Saver")
      case "performance":
        return t("Performance")
      default:
        return t("Unknown")
    }
  })

  function toggle() {
    switch (pp.activeProfile) {
      case "balanced":
        return pp.set_active_profile("power-saver")
      case "power-saver":
        return pp.set_active_profile("balanced")
      case "performance":
        return pp.set_active_profile("balanced")
      default:
        break
    }
  }

  return (
    <MenuToggleButton id="powerprofiles" r={13} px={6} active={active} onToggled={toggle}>
      <Box gap={3}>
        <PowerProfilesIndicator iconSize={18} />
        <Text truncate size={1.1} weight={active((a) => (a ? "bold" : "normal"))}>
          {text}
        </Text>
      </Box>
    </MenuToggleButton>
  )
}
