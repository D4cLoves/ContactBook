import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, TextInput, Select } from '@mantine/core';
import { useState } from 'react';
import Contact from '../Contact/Contact';

interface AddContactModalPageProps {
  onSave: (contact: Contact) => void;
}

export default function AddContactModalPage({ onSave }: AddContactModalPageProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    phone: '',
    type: 'work',
  });

  const handleInputChange = (field: string, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const id = Date.now(); // Временный ID, в реальном проекте лучше использовать UUID
    const newContact = new Contact(
      id,
      contactData.name,
      contactData.surname,
      contactData.patronymic,
      contactData.type,
      [contactData.phone]
    );
    const hasLetters = newContact.phones.some(phone => /[a-zA-Z]/.test(phone));
    if(hasLetters){
        setPhoneError("В номере не должно быть букoв");
        return;
  }
    setPhoneError(null);
    onSave(newContact);
    setContactData({ name: '', surname: '', patronymic: '', phone: '', type: 'work' });
    close();
  };

  return (
    <>
      <Button 
        variant="filled" 
        onClick={open}
        style={{
          background: '#007aff',
          fontWeight: 500,
        }}
      >
        Добавить контакт
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Добавить контакт"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextInput
            label="Имя"
            placeholder="Введите имя"
            value={contactData.name}
            onChange={(e) => handleInputChange('name', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Фамилия"
            placeholder="Введите фамилию"
            value={contactData.surname}
            onChange={(e) => handleInputChange('surname', e.currentTarget.value)}
            required
          />
          <TextInput
            label="Отчество"
            placeholder="Введите отчество"
            value={contactData.patronymic}
            onChange={(e) => handleInputChange('patronymic', e.currentTarget.value)}
          />
          <TextInput
            label="Телефон"
            placeholder="Введите номер телефона"
            value={contactData.phone}
            onChange={(e) => { handleInputChange('phone', e.currentTarget.value);
                if(phoneError) setPhoneError(null);
            }}
            required
            error = {phoneError}
          />
          <Select
            label="Тип контакта"
            placeholder="Выберите тип"
            data={[
              { value: 'work', label: 'Работа' },
              { value: 'family', label: 'Семья' },
              { value: 'friend', label: 'Друзья' },
              { value: 'other', label: 'Другое' },
            ]}
            value={contactData.type}
            onChange={(value) => handleInputChange('type', value || 'work')}
          />
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!contactData.name || !contactData.phone}
            mt="md"
          >
            Сохранить контакт
          </Button>
        </div>
      </Modal>
    </>
  );
}
