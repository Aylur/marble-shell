import Gtk from "gi://Gtk?version=4.0"
import Notifd from "gi://AstalNotifd"
import { createBinding } from "gnim"
import { useStyle, variables as v } from "marble/theme"
import {
  Box,
  Button,
  Icon,
  MenuArrowButton,
  MenuRevealer,
  NotificationActions,
  NotificationAppIcon,
  NotificationAppName,
  NotificationBody,
  NotificationDismissButton,
  NotificationImage,
  NotificationList,
  NotificationRoot,
  NotificationSummary,
  NotificationTimestamp,
  ScrollView,
  Separator,
  Text,
  useNotification,
} from "marble/components"
import { gettext as t } from "gettext"

function Header() {
  const notifd = Notifd.get_default()
  const notifs = createBinding(notifd, "notifications")

  function clear() {
    notifd.get_notifications().map((n, i) => {
      setTimeout(() => n.dismiss(), 100 * i)
    })
  }

  return (
    <Box gap={2}>
      <Box gap={2} py={6} px={4}>
        <Icon icon="org.gnome.Settings-notifications-symbolic" />
        <Text weight="bold">{t("Notifications")}</Text>
      </Box>
      <Button
        flat
        mb={4}
        px={5}
        py={3}
        r={9}
        hexpand
        halign={Gtk.Align.END}
        visible={notifs((l) => l.length > 0)}
        onPrimaryClick={clear}
        color="error"
      >
        <Box gap={2}>
          <Icon icon="user-trash-full-symbolic" />
          <Text weight="bold">{t("Clear")}</Text>
        </Box>
      </Button>
    </Box>
  )
}

function Notification() {
  const { notification: n } = useNotification()
  const id = `notification-${n.id}`

  return (
    <NotificationRoot>
      <Box vertical>
        <Box px={1} gap={2}>
          <NotificationAppIcon color={v.primary} />
          <NotificationAppName opacity={0.8} />
          <NotificationTimestamp opacity={0.7} hexpand halign={Gtk.Align.END} />
          <NotificationDismissButton flat p={2} m={2} r={13} color="error" vfill hfill>
            <Icon icon="window-close" size={16} />
          </NotificationDismissButton>
          <MenuArrowButton iconSize={16} m={2} p={2} r={13} id={id} />
        </Box>
        <MenuRevealer id={id}>
          <Box vertical p={2}>
            <Box gap={6}>
              <NotificationImage r={8} size={86} class={useStyle({ border: v.border })} />
              <Box vertical>
                <NotificationSummary
                  hexpand
                  halign={Gtk.Align.START}
                  weight="bold"
                  class="text-lg"
                />
                <NotificationBody hexpand halign={Gtk.Align.START} justify="fill" />
              </Box>
            </Box>
            {n.get_actions().length > 0 && (
              <Box gap={6} my={6}>
                <NotificationActions color="primary" hfill vfill p={5} r={11} />
              </Box>
            )}
          </Box>
        </MenuRevealer>
      </Box>
    </NotificationRoot>
  )
}

export default function NotificationSection(
  props: Omit<Box.Props, "model" | "children" | "vertical" | "children">,
) {
  const notifs = createBinding(Notifd.get_default(), "notifications")

  return (
    <Box vertical {...props}>
      <Header />
      <Separator mb={4} />
      <ScrollView>
        <Box vertical>
          <NotificationList>{() => <Notification />}</NotificationList>
        </Box>
      </ScrollView>
      <Text
        hexpand
        halign="center"
        weight="bold"
        visible={notifs((ns) => ns.length === 0)}
      >
        {t("Inbox is empty")}
      </Text>
    </Box>
  )
}
