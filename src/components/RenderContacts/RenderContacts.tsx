import { IconPencil, IconTrash, IconPhone } from '@tabler/icons-react';
import { ActionIcon, Avatar, Badge, Table, Text, Tooltip } from '@mantine/core';
import Contact from '../Contact/Contact';
import styles from './RenderContacts.module.css';

const typeColors: Record<string, string> = {
  family: 'blue',
  work: 'cyan',
  friend: 'pink',
  other: 'gray',
};

interface UsersTableProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: number) => void;
  openUser?: (contact: Contact) => void;
}

const generateAvatar = (name: string) => {
  return `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;
};

export default function UsersTable({
  contacts,
  onDelete,
  onEdit,
  openUser,
}: UsersTableProps) {
  const rows = contacts.map((contact) => (
    <Table.Tr
      key={contact.id}
      onClick={() => openUser && openUser(contact)}
      className={styles.tableRow}
      style={{ cursor: 'pointer' }}
    >
      <Table.Td className={styles.tableCell}>
        <div className={styles.avatarGroup}>
          <Avatar size={28} src={generateAvatar(contact.name)} radius="sm" />
          <div>
            <Text className={styles.contactName}>
              {`${contact.surname} ${contact.name} ${contact.patronymic}`}
            </Text>
          </div>
        </div>
      </Table.Td>
      <Table.Td className={styles.tableCell} style={{ textAlign: 'center' }}>
        <div className={styles.typeBadge}>
          <Badge
            color={typeColors[contact.type.toLowerCase()] || 'gray'}
            variant="light"
          >
            {contact.type}
          </Badge>
        </div>
      </Table.Td>
      <Table.Td className={styles.tableCell}>
        <div className={styles.phonesGroup}>
          {/* {contact.phones.map((phone, index) => (
                      <div key={index} className={styles.phoneItem}>
                          <IconPhone size={16} className={styles.phoneIcon} />
                          <Text>{phone}</Text>
                      </div>
                  ))} */}

          <div className={styles.phoneItem}>
            <IconPhone size={16} className={styles.phoneIcon} />
            <Text>{contact.phones[0]}</Text>

            {contact.phones.length > 1 && (
              <Tooltip label="Откройте карточку контакта, чтобы увидеть все номера">
                <Text size="sm" c="dimmed">
                  ...
                </Text>
              </Tooltip>
            )}
          </div>
        </div>
      </Table.Td>
      <Table.Td className={styles.tableCell} style={{ textAlign: 'center' }}>
        <div className={styles.actionsGroup}>
          <Tooltip label="Редактировать">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(contact);
              }}
              size="md"
              className={styles.actionButton}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Удалить">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(contact.id);
              }}
              size="md"
              className={styles.actionButton}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className={styles.tableContainer}>
      <Table className={styles.table}>
        <Table.Thead className={styles.tableHeader}>
          <Table.Tr>
            <Table.Th
              className={styles.tableHeaderCell}
              style={{ width: '35%' }}
            >
              ФИО
            </Table.Th>
            <Table.Th
              className={styles.tableHeaderCell}
              style={{ width: '15%', textAlign: 'center' }}
            >
              Тип
            </Table.Th>
            <Table.Th
              className={styles.tableHeaderCell}
              style={{ width: '30%' }}
            >
              Телефоны
            </Table.Th>
            <Table.Th
              className={styles.tableHeaderCell}
              style={{ width: '20%', textAlign: 'center' }}
            >
              Действия
            </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
}
