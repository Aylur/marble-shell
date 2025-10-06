import Hyprland from "gi://AstalHyprland"
import { Box, Button, Text, Separator, HyprlandClients, Icon } from "marble/components"
import { createBinding } from "gnim"
import { useGnofi } from "#/gnofi"
import { gettext as t } from "gettext"

export default function HyprlandClientList() {
  const { gnofi, hyprlandClientsPicker } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as(
    (p) => p === hyprlandClientsPicker,
  )
  const list = createBinding(Hyprland.get_default(), "clients")

  return (
    <Box vertical visible={isActive}>
      <Separator />

      <Text visible={list((l) => l.length === 0)} m={8} halign="center">
        {t("There are no applications running")}
      </Text>

      <HyprlandClients vertical p={6}>
        {(client) => (
          <Button
            m={2}
            px={5}
            py={3}
            r={9}
            focusable
            hfill
            flat
            onPrimaryClick={() => {
              client.focus()
              gnofi.close()
            }}
          >
            <Box gap={4}>
              <Icon icon={createBinding(client, "class")} size={38} />
              <Text halign="start" valign="center" wrap>
                {createBinding(client, "title").as((t) => t || "")}
              </Text>
            </Box>
          </Button>
        )}
      </HyprlandClients>
    </Box>
  )
}
