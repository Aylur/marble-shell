import Tasks from "marble/service/Tasks"
import { Box, Button, Icon, ScrollView, Separator, Text } from "marble/components"
import { createBinding, For } from "gnim"
import { useGnofi } from "#/gnofi"
import { useStyle, variables as v } from "marble/theme"
import { gettext as t } from "gettext"

function Task({ task }: { task: Tasks.Task }) {
  const summary = createBinding(task, "summary")
  const style = useStyle({
    "&": {
      " Icon": {
        color: "transparent",
      },
      ":focus Icon": {
        color: v.primary,
      },
    },
  })

  return (
    <Box gap={2}>
      <Button
        class={style}
        focusable
        r={11}
        m={2}
        p={3}
        tooltipText={t("Mark as completed")}
        onPrimaryClick={() => (task.completed = true)}
      >
        <Icon size={11} icon="checkmark" />
      </Button>
      <Text truncate valign="center">
        {summary}
      </Text>
    </Box>
  )
}

function List({ list }: { list: Tasks.TaskList }) {
  const name = createBinding(list, "name")
  const user = createBinding(list, "user")
  const tasks = createBinding(list, "tasks").as((ts) => ts.filter((t) => !t.completed))

  return (
    <Box vertical p={6}>
      <Box py={2} gap={6}>
        <Box>
          <Text valign="center" weight="bold">
            {name}
          </Text>
          <Text valign="center">{user((u) => (u ? ` - ${u}` : ""))}</Text>
        </Box>
        <Separator hexpand valign="center" />
      </Box>
      <ScrollView>
        <Box vertical ml={4} gap={2}>
          <For each={tasks}>{(task) => <Task task={task} />}</For>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default function TaskList() {
  const { gnofi, tasksPicker } = useGnofi()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === tasksPicker)
  const tasks = Tasks.get_default()
  const tasklists = createBinding(tasks, "taskLists")

  return (
    <Box vertical visible={isActive}>
      <Separator hexpand valign="center" />
      <Box vertical p={2}>
        <For each={tasklists}>{(list) => <List list={list} />}</For>
      </Box>
      <Text m={6} halign="center" size={1.1} visible={tasklists((ts) => ts.length === 0)}>
        {t("There are no tasks")}
      </Text>
    </Box>
  )
}
