import { useGnofi } from "#/gnofi"
import { createBinding, For } from "gnim"
import { Box, Button, Picture, ScrollView, Separator, Text } from "marble/components"
import { chunk, fill } from "es-toolkit"
import { gettext as t } from "gettext"

export default function WpList() {
  const { gnofi, wpPicker } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === wpPicker)
  const result = createBinding(wpPicker, "result")
  const list = result((r) =>
    chunk(r, 4)
      .slice(0, 4)
      .map((row) => fill(row, null, row.length)),
  )

  return (
    <Box vertical visible={isActive}>
      <Separator />
      <Text m={8} weight="bold" visible={result((r) => r.length === 0)}>
        {t("No match found")}
      </Text>
      <ScrollView>
        <Box vertical p={4} homogeneous>
          <For each={list}>
            {(row) => (
              <Box homogeneous>
                {row.map((file) =>
                  file ? (
                    <Button
                      vfill
                      hfill
                      focusable
                      r={11}
                      m={4}
                      onPrimaryClick={() => (wpPicker.wallpaper = file)}
                      tooltipText={file.get_basename() ?? ""}
                    >
                      <Box r={11} overflowHidden hexpand>
                        <Picture file={file} showSpinner maxHeight={100} hexpand />
                      </Box>
                    </Button>
                  ) : (
                    <Box />
                  ),
                )}
              </Box>
            )}
          </For>
        </Box>
      </ScrollView>
    </Box>
  )
}
