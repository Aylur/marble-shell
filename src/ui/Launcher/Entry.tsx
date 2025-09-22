import { PickerEntry, Box, Button, Icon } from "marble/components"
import { alpha, cls, useStyle, useTailwind, variables as v } from "marble/theme"
import { useGnofi } from "#/gnofi"
import { createBinding } from "gnim"

export default function Entry() {
  const { gnofi } = useGnofi()
  const activePicker = createBinding(gnofi, "activePicker")
  const input = createBinding(gnofi, "text")

  const textClass = useStyle({
    "&": {
      ">placeholder": {
        color: alpha(v.fg, 0.7),
      },
    },
  })

  const textClassTw = useTailwind({
    p: 12,
    pl: 4,
  })

  return (
    <Box>
      <Box ml={12} mr={4}>
        <Icon size={18} color={v.primary} icon={activePicker((p) => p.icon)} />
      </Box>
      <PickerEntry gnofi={gnofi} class={cls(textClass, textClassTw)} />
      <Button
        visible={input((i) => i.length > 0)}
        flat
        vfill
        r={11}
        m={6}
        px={8}
        onPrimaryClick={() => (gnofi.text = "")}
      >
        <Icon icon="edit-clear-symbolic" />
      </Button>
    </Box>
  )
}
