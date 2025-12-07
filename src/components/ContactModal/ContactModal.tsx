import { Modal, Button, TextInput, Select } from '@mantine/core';
import { useState, useEffect } from 'react';
import Contact from '../Contact/Contact';

interface ContactModalProps {
  contact?: Contact;
  onSave: (contact: Contact) => void;
  onClose: () => void;
  opened: boolean;
}

export default function ContactModal({
  contact,
  onSave,
  onClose,
  opened,
}: ContactModalProps) {
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    phones: '',
    type: 'other',
  });

  useEffect(() => {
    if (opened && contact) {
      setContactData({
        name: contact.name,
        surname: contact.surname,
        patronymic: contact.patronymic,
        phones: contact.phones.join(', '),
        type: contact.type,
      });
    } else if (opened && !contact) {
      setContactData({
        name: '',
        surname: '',
        patronymic: '',
        phones: '',
        type: 'other',
      });
    }
    setPhoneError(null);
  }, [opened, contact]);

  const validateAndFormatPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/[\s\(\)\-]/g, '');

    if (!cleanPhone.startsWith('+')) {
      throw new Error('Номер должен начинаться с +');
    }

    if (/[a-zA-Zа-яА-Я]/.test(cleanPhone)) {
      throw new Error('В номере не должно быть букв');
    }

    const digitsAll = cleanPhone.replace(/\D/g, '');

    if (digitsAll.length < 11) {
      throw new Error('Номер должен содержать минимум 11 цифр');
    }
    if (digitsAll.length > 15) {
      throw new Error('Номер слишком длинный');
    }

    const ccDigits = digitsAll.slice(0, 1);
    const countryCode = `+${ccDigits}`;
    const restDigits = digitsAll.slice(1);

    const a = restDigits.slice(0, 3); 
    const b = restDigits.slice(3, 6); 
    const c = restDigits.slice(6, 8); 
    const d = restDigits.slice(8, 10); 

    const formatted = `${countryCode} (${a}) ${b}-${c}-${d}`;

    return formatted;
  };

  const handleInputChange = (field: string, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    if (field === 'phones' && phoneError) {
      setPhoneError(null);
    }
  };

  const handleSubmit = () => {
    const phonesArr = contactData.phones
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);

    if (phonesArr.length === 0) {
      setPhoneError('Введите хотя бы один номер телефона');
      return;
    }

    const validatedPhones: string[] = [];

    for (const phone of phonesArr) {
      try {
        const validationResult = validateAndFormatPhone(phone);
        validatedPhones.push(validationResult);
      } catch (error) {
        setPhoneError(
          error instanceof Error ? error.message : 'Неизвестная ошибка'
        );
        return;
      }
    }

    if (!contactData.name || !contactData.phones) {
      setPhoneError('Имя и телефон обязательны');
      return;
    }

    const newContact = new Contact(
      contact ? contact.id : Date.now(),
      contactData.name,
      contactData.surname,
      contactData.patronymic,
      contactData.type,
      validatedPhones
    );

    onSave(newContact);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={contact ? 'Редактировать контакт' : 'Добавить контакт'}
      centered
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
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
          onChange={(e) =>
            handleInputChange('patronymic', e.currentTarget.value)
          }
        />
        <TextInput
          label="Телефон (через запятую для нескольких)"
          placeholder="+79991234567"
          description="Формат: +7 (999) 123-45-67. Минимум 11 цифр, начинается с +"
          value={contactData.phones}
          onChange={(e) => handleInputChange('phones', e.currentTarget.value)}
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
          disabled={!contactData.name || !contactData.phones}
          mt="md"
        >
          Сохранить контакт
        </Button>
      </div>
    </Modal>
  );
}
