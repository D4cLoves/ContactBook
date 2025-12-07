import { useParams, useNavigate } from 'react-router-dom'; 
import { useContacts } from '../hooks/useContacts';
import {
  Button,
  Text,
  Paper,
  Group,
  Title,
  Avatar,
  Badge,
  Divider,
  Stack,
  Container,
  rem,
} from '@mantine/core';
import { IconPhone, IconPencil, IconChevronLeft } from '@tabler/icons-react';

function generateAvatar(name: string) {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;
}

const typeColors: Record<string, string> = {
  family: 'blue',
  work: 'cyan',
  friend: 'pink',
  other: 'gray',
};

export default function ContactDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts } = useContacts();

  const contact = contacts.find((c) => c.id === Number(id));

  if (!contact) {
    return (
      <Paper
        p="md"
        radius="md"
        withBorder
        style={{ margin: '20px', maxWidth: '600px' }}
      >
        <Title order={3} c="red">
          Контакт не найден
        </Title>
        <Button mt="md" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </Paper>
    );
  }

    return (
    <Container size="sm" py="md">
      <Paper radius="lg" p="xl" shadow="sm" withBorder>

        <Button
          variant="subtle"
          color="gray"
          size="sm"
          leftSection={<IconChevronLeft size={16} />}
          onClick={() => navigate(-1)}
          mb="lg"
          style={{ padding: rem(6) }}
        >
          Назад
        </Button>

        <Group wrap="nowrap" align="start" gap="xl">
          <Avatar
            size={100}
            radius="xl"
            src={generateAvatar(contact.name)}
            alt={contact.name}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />

          <div style={{ flex: 1 }}>
            <Stack gap={6}>
              <Title order={2} fw={600}>
                {contact.name} {contact.surname}
              </Title>
              {contact.patronymic && (
                <Text c="dimmed" size="sm">
                  {contact.patronymic}
                </Text>
              )}
              <Badge
                size="md"
                color={typeColors[contact.type.toLowerCase()] || 'gray'}
                variant="light"
                style={{ alignSelf: 'flex-start' }}
              >
                {contact.type}
              </Badge>
            </Stack>
          </div>
        </Group>

        <Divider my="xl" label="Контактная информация" labelPosition="center" />

        <Stack gap="sm">
          <Group wrap="nowrap" align="center" gap="sm">
            <IconPhone size={18} color="#339AF0" />
            <Text fw={500} size="md" style={{color: 'gray'}}>Телефоны</Text>
          </Group>

          {contact.phones.map((phone, index) => (
            <Paper
              key={index}
              p="sm"
              radius="md"
              withBorder
              style={{
                backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                color: 'black'
              }}
            >
              <Text>{phone}</Text>
            </Paper>
          ))}
        </Stack>

        <Button
          leftSection={<IconPencil size={16} />}
          color="blue"
          variant="outline"
          fullWidth
          mt="xl"
          size="md"
          onClick={() => navigate(`/contact/edit/${contact.id}`)}
        >
          Редактировать контакт
        </Button>
      </Paper>
    </Container>
  );
}
