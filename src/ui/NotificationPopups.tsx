import Gdk from "gi://Gdk?version=4.0"
import {
  Box,
  Icon,
  Separator,
  NotificationPopups,
  NotificationRoot,
  NotificationAppIcon,
  NotificationAppName,
  NotificationTimestamp,
  NotificationDismissButton,
  NotificationTimeoutBar,
  NotificationImage,
  NotificationBody,
  NotificationSummary,
  NotificationRevealer,
  NotificationActions,
} from "marble/components"
import { useStyle, variables as v } from "marble/theme"

export default function Notifications(props: { monitor?: Gdk.Monitor; width?: number }) {
  const style = useStyle({
    "border": v.border,
    "background-color": v.bg,
    "box-shadow": v.shadow.md,
  })

  return (
    <NotificationPopups monitor={props.monitor} anchor="top-right" timeout={3000}>
      {() => (
        <NotificationRoot hideOnHover>
          <Box
            p={5}
            r={15}
            m={13}
            widthRequest={props.width}
            hexpand
            vertical
            class={style}
          >
            <Box p={4}>
              <NotificationAppIcon color={v.primary} css="margin-left:.4em;" />
              <NotificationAppName css="margin-left:.4em;" opacity={0.8} />
              <NotificationTimestamp hexpand halign="end" opacity={0.7} />
              <NotificationDismissButton
                flat
                ml={3}
                r={9}
                p={1}
                color="error"
                vfill
                hfill
              >
                <Icon icon="window-close" size={18} />
              </NotificationDismissButton>
            </Box>
            <Separator />
            <NotificationTimeoutBar r={3} p={0} width={3} length={props.width} />
            <Box pt={8} pb={5} px={5} gap={3}>
              <NotificationImage r={8} size={86} />
              <Box vertical>
                <NotificationSummary size={1.1} hexpand halign="start" weight="bold" />
                <NotificationBody hexpand halign="start" justify="fill" />
              </Box>
            </Box>
            <NotificationRevealer actions>
              <Box p={4} gap={8}>
                <NotificationActions color="primary" hfill vfill p={5} r={11} />
              </Box>
            </NotificationRevealer>
          </Box>
        </NotificationRoot>
      )}
    </NotificationPopups>
  )
}
