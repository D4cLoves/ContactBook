import { useState, useEffect, useRef } from 'react';
import { Container, Group, Stack, Title } from '@mantine/core';
import UsersTable from './components/RenderContacts/RenderContacts';
import { DarkLightButton } from './components/DarkLightButton/DarkLightButton';
import AddContactModalPage from './components/AddContactModalPage/AddContactModalPage';
import OnEditModalPage from './components/OnEditModalPage/OnEditModalPage';
import ContactViewModal from './components/ContactViewModal/ContactViewModal';
import { SearchContact } from './components/SearchContact/SearchContact';
import { useContacts } from './hooks/useContacts';
import Contact from './components/Contact/Contact';
import styles from './App.module.css';

// Функция для генерации тестовых контактов
const generateDemoContacts = (): Contact[] => {
  const names = [
    { name: 'Александр', surname: 'Иванов', patronymic: 'Петрович', type: 'work', phone: '+7 (999) 123-45-67' },
    { name: 'Мария', surname: 'Петрова', patronymic: 'Сергеевна', type: 'family', phone: '+7 (999) 234-56-78' },
    { name: 'Дмитрий', surname: 'Сидоров', patronymic: 'Александрович', type: 'friend', phone: '+7 (999) 345-67-89' },
    { name: 'Анна', surname: 'Козлова', patronymic: 'Владимировна', type: 'work', phone: '+7 (999) 456-78-90' },
    { name: 'Сергей', surname: 'Новиков', patronymic: 'Игоревич', type: 'friend', phone: '+7 (999) 567-89-01' },
    { name: 'Елена', surname: 'Морозова', patronymic: 'Дмитриевна', type: 'family', phone: '+7 (999) 678-90-12' },
    { name: 'Андрей', surname: 'Волков', patronymic: 'Сергеевич', type: 'work', phone: '+7 (999) 789-01-23' },
    { name: 'Ольга', surname: 'Лебедева', patronymic: 'Андреевна', type: 'friend', phone: '+7 (999) 890-12-34' },
    { name: 'Иван', surname: 'Соколов', patronymic: 'Петрович', type: 'other', phone: '+7 (999) 901-23-45' },
    { name: 'Татьяна', surname: 'Павлова', patronymic: 'Николаевна', type: 'work', phone: '+7 (999) 012-34-56' },
    { name: 'Михаил', surname: 'Федоров', patronymic: 'Владимирович', type: 'friend', phone: '+7 (999) 111-22-33' },
    { name: 'Наталья', surname: 'Медведева', patronymic: 'Ивановна', type: 'family', phone: '+7 (999) 222-33-44' },
    { name: 'Владимир', surname: 'Егоров', patronymic: 'Александрович', type: 'work', phone: '+7 (999) 333-44-55' },
    { name: 'Юлия', surname: 'Орлова', patronymic: 'Сергеевна', type: 'friend', phone: '+7 (999) 444-55-66' },
    { name: 'Павел', surname: 'Макаров', patronymic: 'Дмитриевич', type: 'other', phone: '+7 (999) 555-66-77' },
  ];

  return names.map((contact, index) => 
    new Contact(
      Date.now() + index,
      contact.name,
      contact.surname,
      contact.patronymic,
      contact.type,
      [contact.phone]
    )
  );
};

export default function App() {
  const { contacts, addContact, onDelete, onEdit } = useContacts();
  const demoContactsAdded = useRef(false);
  
  // Добавляем демо-контакты при первом запуске, если контактов нет
  useEffect(() => {
    if (demoContactsAdded.current) return;
    
    const savedContacts = localStorage.getItem('contacts');
    if (!savedContacts || JSON.parse(savedContacts).length === 0) {
      const demoContacts = generateDemoContacts();
      // Устанавливаем контакты в localStorage
      localStorage.setItem('contacts', JSON.stringify(demoContacts));
      // Добавляем контакты в состояние (React 18+ батчит обновления)
      demoContacts.forEach(contact => {
        addContact(contact);
      });
      demoContactsAdded.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.surname} ${contact.name} ${contact.patronymic}`.toLowerCase();
    const phones = contact.phones.join(' ').toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || phones.includes(query);
  });

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedContact: Contact) => {
    onEdit(updatedContact);
    setIsEditModalOpen(false);
    setEditingContact(null);
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewModalOpen(true);
  };

  return (
    <Container size="xl" className={styles.container}>
      <div className={styles.contentWrapper}>
        <Stack gap="md">
          <Group justify="space-between" align="center" className={styles.header}>
            <Title order={1} className={styles.title}>
              Телефонная книга
            </Title>
            <DarkLightButton />
          </Group>

          <Group justify="space-between" align="flex-end" wrap="nowrap">
            <div className={styles.searchContainer}>
              <SearchContact
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
              />
            </div>
            <AddContactModalPage onSave={addContact} />
          </Group>

          <UsersTable
            contacts={filteredContacts}
            onDelete={onDelete}
            onEdit={handleEdit}
            openUser={handleViewContact}
          />
        </Stack>
      </div>

      {selectedContact && (
        <ContactViewModal
          contact={selectedContact}
          opened={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedContact(null);
          }}
        />
      )}

      {editingContact && (
        <OnEditModalPage
          contact={editingContact}
          opened={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingContact(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </Container>
  );
}
