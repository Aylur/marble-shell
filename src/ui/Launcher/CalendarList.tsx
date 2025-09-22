import GLib from "gi://GLib?version=2.0"
import { createBinding, createState, For } from "gnim"
import { Box, ScrollView, Separator, Text, Calendar } from "marble/components"
import Calendars from "marble/service/Calendars"
import { useEffect } from "gnim-hooks"
import { useGnofi } from "#/gnofi"

function now() {
  const now = GLib.DateTime.new_now_local()
  return {
    day: now.get_day_of_month(),
    month: now.get_month(),
    year: now.get_year(),
  }
}

function Events({ calendar }: { calendar: Calendars.Calendar }) {
  const events = createBinding(calendar, "events")

  return (
    <Box vertical visible={events((e) => e.length > 0)}>
      <Text weight="bold">{createBinding(calendar, "name")}</Text>
      <ScrollView>
        <Box vertical py={2} px={4}>
          <For each={events}>
            {(event) => <Text truncate>{`${event.day}. ${event.summary}`}</Text>}
          </For>
        </Box>
      </ScrollView>
    </Box>
  )
}

export default function CalendarList() {
  const { gnofi, calendarPicker } = useGnofi()
  const eds = Calendars.get_default()
  const isActive = createBinding(gnofi, "activePicker").as((p) => p === calendarPicker)
  const list = createBinding(eds, "calendars")
  const events = createBinding(eds, "events")
  const [date, setDate] = createState(now())
  const label = date(
    ({ day, month, year }) =>
      GLib.DateTime.new_local(year, month, day, 0, 0, 0).format("%Y. %m. %d.")!,
  )

  useEffect((get) => {
    if (get(isActive)) {
      setDate(now())
    }
  })

  return (
    <Box vertical visible={isActive}>
      <Separator />
      <Box homogeneous p={6} gap={6}>
        <Calendar
          date={date}
          onDate={(date) => {
            setDate(date)
            eds.calendars.map((c) => {
              c.start = new Date(date.year, date.month - 1, 1)
              c.end = new Date(date.year, date.month, 1)
            })
          }}
          events={events}
        />
        <Box vertical gap={4}>
          <Text halign="center" weight="bold" size={2}>
            {label}
          </Text>
          <For each={list}>{(calendar) => <Events calendar={calendar} />}</For>
        </Box>
      </Box>
    </Box>
  )
}
