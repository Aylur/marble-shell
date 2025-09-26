import Adw from "gi://Adw?version=1"
import { Box, PickerModal } from "marble/components"
import Entry from "./Entry"
import DefaultSearchList from "./DefaultSearchList"
import HelpList from "./HelpList"
import ProviderList from "./ProviderList"
import NixList from "./NixList"
import Dock from "./Dock"
import TaskList from "./TaskList"
import CalendarList from "./CalendarList"
import WpList from "./WpList"
import HyprlandClientList from "./HyprlandClientList"
import { useGnofi } from "#/gnofi"
import { dialogStyle } from "#/theme"
import { useStyle } from "marble/theme"
import app from "#/app"

export default function Launcher() {
  const { gnofi, filesPicker, softwarePicker, calcPicker } = useGnofi()

  return (
    <PickerModal gnofi={gnofi} m={80} valign="start">
      <Adw.Clamp maximumSize={620}>
        <Box vertical widthRequest={620} r={17} class={useStyle(dialogStyle)}>
          <Entry />
          <Dock />
          <DefaultSearchList />
          <TaskList />
          <CalendarList />
          <HelpList />
          <WpList />
          {app.isHyprland && <HyprlandClientList />}
          {filesPicker.app && <ProviderList provider={filesPicker} />}
          {softwarePicker.app && <ProviderList provider={softwarePicker} />}
          {calcPicker.app && <ProviderList provider={calcPicker} />}
          {app.hasNix && <NixList />}
        </Box>
      </Adw.Clamp>
    </PickerModal>
  )
}
