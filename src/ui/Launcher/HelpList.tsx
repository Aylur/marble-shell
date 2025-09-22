import { Box, Button, Text, Separator, Icon } from "marble/components"
import { createBinding, For } from "gnim"
import { variables as v } from "marble/theme"
import { useGnofi } from "#/gnofi"

export default function HelpList() {
  const { gnofi } = useGnofi()
  const help = gnofi.builtinHelpPicker
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === help)
  const result = createBinding(help, "result")
  const leader = createBinding(gnofi, "commandLeader")

  return (
    <Box vertical visible={isActive}>
      <Separator />
      <Box vertical p={8}>
        <For each={result}>
          {(picker) => (
            <Button
              visible={!!picker.description}
              my={2}
              px={5}
              py={5}
              r={9}
              focusable
              hfill
              flat
              onPrimaryClick={() => help.activate(picker)}
            >
              <Box gap={6}>
                <Icon size={18} color={v.primary} icon={createBinding(picker, "icon")} />
                <Text weight="bold">{leader((l) => `${l}${picker.command}`)}</Text>
                <Text hexpand halign="end">
                  {picker.description}
                </Text>
              </Box>
            </Button>
          )}
        </For>
      </Box>
    </Box>
  )
}
