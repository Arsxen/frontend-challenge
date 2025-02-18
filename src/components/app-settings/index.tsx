import { ActionIcon, Drawer, Popover, Select } from '@mantine/core'
import { useDisclosure, useLocalStorage } from '@mantine/hooks'
import { useState } from 'react'
import { FaGear } from 'react-icons/fa6'
import { useAppSettings } from 'src/hooks/local-storage'
import type { Settings, UnitOfMeasurement } from 'src/types/settings'

export function AppSettings() {
  const [opened, setOpened] = useState(false)
  const [settings, setSettings] = useAppSettings()

  const onSelect = (value: string | null) => {
    setSettings({
      unitOfMeasurement: (value as UnitOfMeasurement) ?? 'standard',
    })
  }

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      withArrow
      closeOnClickOutside={false}
    >
      <Popover.Target>
        <ActionIcon
          variant="default"
          size="lg"
          onClick={() => setOpened((opened) => !opened)}
        >
          <FaGear />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Select
          label="Unit of measurement"
          value={settings.unitOfMeasurement}
          onChange={onSelect}
          data={[
            { label: 'Standard', value: 'standard' },
            { label: 'Imperial', value: 'imperial' },
            { label: 'Metric', value: 'metric' },
          ]}
        />
      </Popover.Dropdown>
    </Popover>
  )
}
