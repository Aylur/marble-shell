import Gdk from "gi://Gdk?version=4.0"
import QuickSettings from "./QuickSettings"
import Hyprland from "gi://AstalHyprland"
import { createBinding, createState, State } from "gnim"
import {
  Box,
  Button,
  Icon,
  HyprlandClients,
  HyprlandWorkspaces,
  ClockLabel,
  NotificationsIndicator,
  MediaIndicator,
  BluetoothIndicator,
  MicrophoneIndicator,
  NetworkIndicator,
  PowerProfilesIndicator,
  SpeakerIndicator,
  BatteryIndicator,
  BatteryLabel,
  TrayItems,
  Bar,
  BarCorners,
  HyprlandClientButton,
  TrayButton,
  TrayMenu,
  HyprlandKeyboardLayoutIndicator,
} from "marble/components"
import { useConnect } from "gnim-hooks"
import { cls, useStyle, variables as v } from "marble/theme"
import { useGnofi } from "#/gnofi"
import app from "#/app"

const style: Button.Props = {
  px: 5,
  py: 3,
  m: 3,
  r: 11,
  vfill: true,
  flat: true,
}

function BarStart() {
  const { gnofi } = useGnofi()
  const gnofiOpen = createBinding(gnofi, "isOpen")
  const activeStyle = useStyle({
    "&": {
      ".checked Gizmo.focused": {
        "box-shadow": v.shadow.sm,
      },
    },
  })

  return (
    <Box>
      <Button
        {...style}
        class={cls(
          activeStyle,
          gnofiOpen((v) => v && "checked"),
        )}
        onPrimaryClick={() => gnofi.open("")}
      >
        <Icon icon="fire" />
      </Button>
      {app.isHyprland && (
        <Button {...style} onPrimaryClick={() => gnofi.open(":w ")}>
          <HyprlandWorkspaces vexpand size={1} />
        </Button>
      )}
      {app.isHyprland && (
        <HyprlandClients>
          {(client) => <HyprlandClientButton client={client} {...style} />}
        </HyprlandClients>
      )}
    </Box>
  )
}

function BarCenter() {
  const { gnofi } = useGnofi()
  return (
    <Box>
      <Button onPrimaryClick={() => gnofi.open(":cal ")} {...style}>
        <ClockLabel weight="bold" size={1.1} format="%H:%M - %A %e." />
      </Button>
    </Box>
  )
}

function BarEnd({ open }: { open: State<boolean> }) {
  const [isOpen, setOpen] = open
  const powerDialog = createBinding(app, "powerDialog")

  function hyprlandSwitchKybLayout() {
    const hyprland = Hyprland.get_default()
    hyprland.message_async("j/devices", (_, res) => {
      const { keyboards } = JSON.parse(hyprland.message_finish(res)) as {
        keyboards: Array<{ name: string }>
      }

      for (const { name } of keyboards) {
        hyprland.message_async(`switchxkblayout ${name} next`, null)
      }
    })
  }

  return (
    <Box>
      <TrayItems filter={(item) => item.title !== "spotify"}>
        {(item) => (
          <TrayButton {...style} item={item}>
            <TrayMenu item={item} />
          </TrayButton>
        )}
      </TrayItems>
      {app.isHyprland && (
        <Button {...style} onPrimaryClick={hyprlandSwitchKybLayout}>
          <HyprlandKeyboardLayoutIndicator
            weight="bold"
            format={(l) => l.slice(0, 2).toLowerCase()}
          />
        </Button>
      )}
      <Button {...style} active={isOpen} onPrimaryClick={() => setOpen(true)}>
        <Box gap={7}>
          <MediaIndicator gap={3} />
          <NotificationsIndicator hideNotif hideEmpty />
          <BluetoothIndicator hideDisabled />
          <PowerProfilesIndicator hideBalanced />
          <NetworkIndicator />
          <SpeakerIndicator />
          <MicrophoneIndicator />
          <Box gap={1}>
            <BatteryIndicator />
            <BatteryLabel hideOnFull weight="bold" size={1.1} />
          </Box>
          <NotificationsIndicator hideEmpty hideDnd />
        </Box>
      </Button>
      <Button
        {...style}
        color="error"
        active={powerDialog((action) => action !== null)}
        onPrimaryClick={() => (app.powerDialog = "poweroff")}
      >
        <Icon icon="system-shutdown" />
      </Button>
    </Box>
  )
}

export default function TopBar({ monitor }: { monitor: Gdk.Monitor }) {
  const { gnofi } = useGnofi()
  const qsOpen = createState(false)
  const [, setQsOpen] = qsOpen

  // useConnect(gnofi, "notify::is-open", () => {
  //   if (gnofi.isOpen) {
  //     setQsOpen(false)
  //   }
  // })

  return (
    <>
      <Bar
        monitor={monitor}
        position="top"
        start={<BarStart />}
        center={<BarCenter />}
        end={<BarEnd open={qsOpen} />}
      />
      <BarCorners position="top" r={13} monitor={monitor} />
      <QuickSettings open={qsOpen} monitor={monitor} />
    </>
  )
}
