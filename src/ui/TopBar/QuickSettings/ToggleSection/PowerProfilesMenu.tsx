import Gtk from "gi://Gtk?version=4.0"
import PowerProfiles from "gi://AstalPowerProfiles"
import { Box, Button, Icon, Separator, Text, MenuRevealer } from "marble/components"
import { cls, useStyle, variables as v } from "marble/theme"
import { createBinding } from "gnim"
import { gettext as t } from "gettext"

const profiles = [
  ["power-saver", "power-profile-power-saver-symbolic", t("Power Saver")],
  ["balanced", "power-profile-balanced-symbolic", t("Balanced")],
  ["performance", "power-profile-performance-symbolic", t("Performance")],
]

export default function PowerProfilesMenu() {
  const pp = PowerProfiles.get_default()
  const activeStyle = useStyle({ color: v.primary })
  const isActive = (profile: string) =>
    createBinding(pp, "activeProfile").as((p) => p === profile)

  return (
    <MenuRevealer id="powerprofiles">
      <Box my={10} vertical>
        <Box gap={2} p={3}>
          <Icon icon="org.gnome.Settings-power-symbolic" size={18} />
          <Text weight="bold">{t("Power Profiles")}</Text>
        </Box>
        <Separator />
        <Box vertical gap={1}>
          {profiles.map(([profile, icon, text]) => (
            <Button
              r={7}
              m={1}
              px={5}
              py={3}
              hfill
              flat
              onPrimaryClick={() => pp.set_active_profile(profile)}
            >
              <Box gap={3}>
                <Icon
                  class={cls(isActive(profile)((a) => a && activeStyle))}
                  icon={icon}
                  size={18}
                />
                <Text weight={isActive(profile)((a) => (a ? "bold" : "normal"))}>
                  {text}
                </Text>
                <Icon
                  visible={isActive(profile)}
                  class={activeStyle}
                  hexpand
                  halign={Gtk.Align.END}
                  icon="checkmark"
                  size={16}
                />
              </Box>
            </Button>
          ))}
        </Box>
      </Box>
    </MenuRevealer>
  )
}
