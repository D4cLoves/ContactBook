import { IconArrowRight, IconSearch } from '@tabler/icons-react';
import { ActionIcon, TextInput } from '@mantine/core';
import type React from 'react';

interface searchInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchContact({ value, onChange }: searchInputProps) {
  return (
    <TextInput
      radius="md"
      size="md"
      placeholder="Найти контакт..."
      rightSectionWidth={42}
      value={value}
      onChange={onChange}
      leftSection={<IconSearch size={18} stroke={1.5} />}
      rightSection={
        <ActionIcon size={32} radius="md" variant="filled" color="dark.6">
          <IconArrowRight size={18} stroke={1.5} />
        </ActionIcon>
      }
    />
  );
}
