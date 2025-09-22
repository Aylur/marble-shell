import Gtk from "gi://Gtk?version=4.0"
import { Box, Separator, Text, Button } from "marble/components"
import { createBinding, For } from "gnim"
import { SearchPicker } from "gnofi"
import { useGnofi } from "#/gnofi"
import { gettext as t } from "gettext"

export default function SearchList({ provider }: { provider: SearchPicker }) {
  const { gnofi } = useGnofi()
  const result = createBinding(provider, "result")
  const surplus = createBinding(provider, "resultSurplus")
  const appIcon = provider.app?.get_icon()
  const appName = provider.app?.get_name()

  return (
    <Box vertical visible={result((res) => res.length > 0)}>
      <Box pr={8}>
        {appName && (
          <Button
            mx={8}
            r={11}
            px={5}
            py={3}
            focusable
            onPrimaryClick={() => {
              provider.activate(gnofi.text)
              gnofi.close()
            }}
            hfill
            halign="start"
          >
            <Box gap={4}>
              {appIcon && <Gtk.Image gicon={appIcon} />}
              <Text>{appName}</Text>
              <Text visible={surplus((v) => v > 0)} ml={4}>
                {surplus((v) => t("%d more").format(v))}
              </Text>
            </Box>
          </Button>
        )}
        <Separator hexpand valign="center" />
      </Box>
      <Box vertical p={4} pb={6}>
        <For each={result}>
          {(item) => (
            <Button
              focusable
              mx={4}
              my={2}
              px={3}
              py={1}
              r={9}
              flat
              hfill
              onPrimaryClick={() => {
                item.activate()
                gnofi.close()
              }}
            >
              <Box gap={4}>
                {item.gicon && <Gtk.Image gicon={item.gicon} />}
                <Text truncate>{item.name}</Text>
              </Box>
            </Button>
          )}
        </For>
      </Box>
    </Box>
  )
}
