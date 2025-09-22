import { Box, Separator, Text } from "marble/components"
import { createBinding, For } from "gnim"
import SearchList from "./SearchList"
import AppButton from "./AppButton"
import { useGnofi } from "#/gnofi"
import { SearchPicker } from "gnofi"
import { gettext as t } from "gettext"

export default function DefaultSearchList() {
  const { appPicker, gnofi } = useGnofi()
  const result = createBinding(appPicker, "result").as((res) => res.slice(0, 5))

  const providers = createBinding(gnofi.builtinDefaultPicker, "pickers")
  const pickers = providers((pickers) => pickers.filter((p) => p instanceof SearchPicker))

  const isActive = createBinding(gnofi, "activePicker").as(
    (p) => p === gnofi.builtinDefaultPicker,
  )

  return (
    <Box vertical visible={isActive}>
      <Separator />
      <Box p={4} homogeneous>
        <Text halign="center" m={4} visible={result((l) => l.length === 0)}>
          {t("No application found")}
        </Text>
        <For each={result}>{(app) => <AppButton app={app} label />}</For>
      </Box>
      <For each={pickers}>
        {(provider) => <SearchList provider={provider as SearchPicker} />}
      </For>
    </Box>
  )
}
