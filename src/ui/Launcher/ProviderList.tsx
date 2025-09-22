import { SearchPicker } from "gnofi"
import SearchList from "./SearchList"
import { createBinding } from "gnim"
import { Box, Separator, Text } from "marble/components"
import { useGnofi } from "#/gnofi"
import { gettext as t } from "gettext"

export default function ProviderList({ provider }: { provider: SearchPicker }) {
  const { gnofi } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === provider)
  const noMatch = createBinding(provider, "result").as((r) => r.length <= 0)

  return (
    <Box vertical visible={isActive}>
      <SearchList provider={provider} />
      <Separator visible={noMatch} />
      <Text visible={noMatch} m={8} halign="center">
        {t("No match found")}
      </Text>
    </Box>
  )
}
