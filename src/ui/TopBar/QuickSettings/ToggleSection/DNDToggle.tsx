import Adw from "gi://Adw?version=1"
import Notifd from "gi://AstalNotifd"
import { NotificationsIndicator, Box, Button, Text } from "marble/components"
import { createBinding } from "gnim"
import { gettext as t } from "gettext"

export default function DNDToggle() {
  const notifd = Notifd.get_default()
  const dnd = createBinding(notifd, "dontDisturb")

  return (
    <Adw.Bin>
      <Button
        r={13}
        px={6}
        hfill
        vfill
        hexpand
        active={dnd}
        onToggled={(active) => notifd.set_dont_disturb(active)}
      >
        <Box gap={3}>
          <NotificationsIndicator
            iconSize={18}
            emptyIcon="org.gnome.Settings-notifications-symbolic"
            dndIcon="notifications-disabled-symbolic"
            notifIcon="org.gnome.Settings-notifications-symbolic"
          />
          <Text size={1.1} weight={dnd((d) => (d ? "bold" : "normal"))}>
            {dnd((d) => (d ? t("Silent") : t("Noisy")))}
          </Text>
        </Box>
      </Button>
    </Adw.Bin>
  )
}
