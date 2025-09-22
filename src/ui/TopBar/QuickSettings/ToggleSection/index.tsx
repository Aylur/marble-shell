import { Box } from "marble/components"
import BluetoothMenu from "./BluetoothMenu"
import BluetoothToggle from "./BluetoothToggle"
import DNDToggle from "./DNDToggle"
import MuteToggle from "./MuteToggle"
import PowerProfilesMenu from "./PowerProfilesMenu"
import PowerProfilesToggle from "./PowerProfilesToggle"
import ThemeMenu from "./ThemeMenu"
import ThemeToggle from "./ThemeToggle"
import WifiMenu from "./WifiMenu"
import WifiToggle from "./WifiToggle"

export default function ToggleSection(props: Omit<Box.Props, "vertical" | "children">) {
  const { gap = 0, ...rest } = props
  const mt = gap / 2

  return (
    <Box vertical {...rest}>
      <Box gap={gap} homogeneous heightRequest={44}>
        <BluetoothToggle />
        <WifiToggle />
      </Box>
      <Box mt={mt} />
      <BluetoothMenu />
      <WifiMenu />
      <Box mt={mt} />
      <Box gap={gap} homogeneous heightRequest={44}>
        <PowerProfilesToggle />
        <ThemeToggle />
      </Box>
      <Box mt={mt} />
      <PowerProfilesMenu />
      <ThemeMenu />
      <Box mt={mt} />
      <Box gap={gap} homogeneous heightRequest={44}>
        <DNDToggle />
        <MuteToggle />
      </Box>
    </Box>
  )
}
