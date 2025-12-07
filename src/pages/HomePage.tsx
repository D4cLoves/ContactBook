import UsersTable from '../components/RenderContacts/RenderContacts';
import { useContacts } from '../hooks/useContacts';
import { Button } from '@mantine/core';
import styles from '../App.module.css';
import { SearchContact } from '../components/SearchContact/SearchContact';
import { useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconBriefcase,
  IconHome,
  IconUserCircle,
  IconUser,
  IconFilter,
} from '@tabler/icons-react';

type Category = 'all' | 'work' | 'family' | 'friend' | 'other';

const categories: { key: Category; label: string; icon: React.FC<any> }[] = [
  { key: 'work', label: 'Работа', icon: IconBriefcase },
  { key: 'family', label: 'Семья', icon: IconHome },
  { key: 'friend', label: 'Друзья', icon: IconUserCircle },
  { key: 'other', label: 'Другое', icon: IconUser },
];

export default function HomePage() {
  const { contacts, openAddModal, onDelete, onEdit, openUserModal } =
    useContacts();

  const [categoryFilter, setCategoryFilter] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredContacts =
    categoryFilter === 'all'
      ? contacts
      : contacts.filter((c) => c.type.toLowerCase() === categoryFilter);

  const finalFilteredContacts = filteredContacts.filter((contact) => {
    const lowerCaseS = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(lowerCaseS) ||
      contact.phones.some((phomeNumber) => {
        return phomeNumber.toLowerCase().includes(lowerCaseS);
      })
    );
  });

  return (
    <>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <SearchContact
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip label="Все">
              <ActionIcon
                variant={categoryFilter === 'all' ? 'filled' : 'subtle'}
                color="dark"
                radius="md"
                onClick={() => setCategoryFilter('all')}
              >
                <IconFilter size={18} />
              </ActionIcon>
            </Tooltip>

            {categories.map(({ key, label, icon: Icon }) => (
              <Tooltip key={key} label={label}>
                <ActionIcon
                  variant={categoryFilter === key ? 'filled' : 'subtle'}
                  color="dark   "
                  radius="md"
                  onClick={() => setCategoryFilter(key)}
                >
                  <Icon size={18} />
                </ActionIcon>
              </Tooltip>
            ))}
          </div>
          <Button
            variant="filled"
            color="dark"
            radius="md"
            className={styles.addButton}
            onClick={openAddModal}
          >
            Добавить контакт
          </Button>
        </div>
        <UsersTable
          contacts={finalFilteredContacts}
          onDelete={onDelete}
          onEdit={onEdit}
          openUser={openUserModal}
        />
      </div>
    </>
  );
}
