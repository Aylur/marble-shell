import { Box, Button, Text, Separator } from "marble/components"
import { createBinding, For } from "gnim"
import { useGnofi } from "#/gnofi"
import { gettext as t } from "gettext"

export default function NixList() {
  const { gnofi, nixPicker } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === nixPicker)
  const result = createBinding(nixPicker, "result")

  return (
    <Box vertical visible={isActive}>
      <Separator />

      <Text visible={result((res) => res.length === 0)} m={8} halign="center">
        {t("No match found")}
      </Text>

      <Box vertical p={6} visible={result((res) => res.length > 0)}>
        <For each={result}>
          {({ pname, version, description }) => (
            <Button
              m={2}
              px={5}
              py={3}
              r={9}
              focusable
              hfill
              flat
              onPrimaryClick={() => {
                nixPicker.activate(pname)
                gnofi.close()
              }}
            >
              <Box>
                <Box vertical>
                  <Text halign="start" wrap size={1.1} weight="bold">
                    {pname}
                  </Text>
                  <Text xalign={0} halign="start" noMarkup wrap opacity={0.8}>
                    {description}
                  </Text>
                </Box>
                <Text valign="start" halign="end" opacity={0.8} hexpand weight="bold">
                  {version}
                </Text>
              </Box>
            </Button>
          )}
        </For>
      </Box>
    </Box>
  )
}
