import { Button } from '@mantine/core';

interface AddContactButtonProps {
  onOpen: () => void;
}

export default function AddContactButton({ onOpen }: AddContactButtonProps) {
  return (
    <Button variant="default" onClick={onOpen}>
      Добавить контакт
    </Button>
  );
}
