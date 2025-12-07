import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, TextInput, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import Contact from "../Contact/Contact";

interface OnEditModalPageProps {
  contact: Contact;
  opened: boolean;
  onClose: () => void;
  onSave: (updatedContact: Contact) => void;
}

export default function OnEditModalPage({ 
  contact, 
  opened, 
  onClose, 
  onSave 
}: OnEditModalPageProps) {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    name: contact.name,
    surname: contact.surname,
    patronymic: contact.patronymic,
    phone: contact.phones[0] || '',
    type: contact.type,
  });

  useEffect(() => {
    setContactData({
      name: contact.name,
      surname: contact.surname,
      patronymic: contact.patronymic,
      phone: contact.phones[0] || '',
      type: contact.type,
    });
  }, [contact]);

  const handleInputChange = (field: string, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const hasLetters = /[a-zA-Z]/.test(contactData.phone);
    if (hasLetters) {
      setPhoneError("В номере не должно быть букв");
      return;
    }
    
    setPhoneError(null);
    const updatedContact = new Contact(
      contact.id,
      contactData.name,
      contactData.surname,
      contactData.patronymic,
      contactData.type,
      [contactData.phone]
    );
    onSave(updatedContact);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Редактировать контакт"
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
          onChange={(e) => {
            handleInputChange('phone', e.currentTarget.value);
            if (phoneError) setPhoneError(null);
          }}
          required
          error={phoneError}
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
          Сохранить изменения
        </Button>
      </div>
    </Modal>
  );
}
