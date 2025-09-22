import { Box, Separator } from "marble/components"
import { createBinding, For } from "gnim"
import AppButton from "./AppButton"
import TaskList from "./TaskList"
import { useGnofi } from "#/gnofi"

export default function Dock() {
  const { gnofi, appPicker, dockPicker } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === dockPicker)
  const apps = createBinding(dockPicker, "result").as((names) =>
    names.map((name) => appPicker.search(name).at(0)).filter((app) => !!app),
  )

  return (
    <Box vertical visible={isActive}>
      <Separator />
      <Box p={4} homogeneous>
        <For each={apps}>{(app) => <AppButton app={app} />}</For>
      </Box>
      <Box homogeneous>
        <TaskList />
      </Box>
    </Box>
  )
}
