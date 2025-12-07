import {
  Modal,
  Button,
  TextInput,
  Select,
  Stack,
  Group,
  Title,
  Paper,
} from '@mantine/core';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useContacts } from '../hooks/useContacts';
import Contact from '../components/Contact/Contact';
import {
  IconPhone,
  IconUser,
} from '@tabler/icons-react';

export default function ContactModalPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { contacts, addContact, onEdit } = useContacts();
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    name: '',
    surname: '',
    patronymic: '',
    phones: '',
    type: 'other',
  });
  const isEdit = id !== undefined;
  const contact = isEdit ? contacts.find((c) => c.id === Number(id)) : null;

  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isEdit && contact) {
      setContactData({
        name: contact.name,
        surname: contact.surname,
        patronymic: contact.patronymic,
        phones: contact.phones.join(', '),
        type: contact.type,
      });
    } else {
      setContactData({
        name: '',
        surname: '',
        patronymic: '',
        phones: '',
        type: 'other',
      });
    }
    setPhoneError(null);
  }, [isEdit, contact]);

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

    const a = restDigits.slice(0, 3); // (AAA)
    const b = restDigits.slice(3, 6); // BBB
    const c = restDigits.slice(6, 8); // CC
    const d = restDigits.slice(8, 10); // DD

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
    const finalId = isEdit && contact ? contact.id : Date.now();
    const newContact = new Contact(
      finalId,
      contactData.name,
      contactData.surname,
      contactData.patronymic,
      contactData.type,
      validatedPhones
    );

    if (isEdit) {
      onEdit(newContact);
    } else {
      addContact(newContact);
    }
    navigate('/');
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (isEdit && !contact) {
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
        <Button mt="md" onClick={handleClose}>
          Назад
        </Button>
      </Paper>
    );
  }

  return (
    <Modal
      opened
      onClose={handleClose}
      title={isEdit ? 'Редактировать контакт' : 'Новый контакт'}
      centered
      size="sm"
      padding="xl"
      transitionProps={{ transition: 'fade', duration: 200 }}
    >
      <Stack gap="md">
        {/* Имя */}
        <TextInput
          ref={nameInputRef}
          label="Имя"
          placeholder="Иван"
          value={contactData.name}
          onChange={(e) => handleInputChange('name', e.currentTarget.value)}
          required
          leftSection={<IconUser size={16} />}
          error={contactData.name ? undefined : 'Обязательно'}
        />

        {/* Фамилия */}
        <TextInput
          label="Фамилия"
          placeholder="Иванов"
          value={contactData.surname}
          onChange={(e) => handleInputChange('surname', e.currentTarget.value)}
          leftSection={<IconUser size={16} />}
        />

        {/* Отчество */}
        <TextInput
          label="Отчество"
          placeholder="Иванович"
          value={contactData.patronymic}
          onChange={(e) => handleInputChange('patronymic', e.currentTarget.value)}
          leftSection={<IconUser size={16} />}
        />

        {/* Телефон */}
        <TextInput
          label="Телефон(ы)"
          placeholder="+79991234567"
          description="Несколько — через запятую"
          value={contactData.phones}
          onChange={(e) => handleInputChange('phones', e.currentTarget.value)}
          required
          error={phoneError}
          leftSection={<IconPhone size={16} />}
        />

        {/* Тип контакта */}
        <Select
          label="Тип"
          placeholder="Выберите тип"
          data={[
            { value: 'work', label: 'Работа' },
            { value: 'family', label: 'Семья' },
            { value: 'friend', label: 'Друзья' },
            { value: 'other', label: 'Другое' },
          ]}
          value={contactData.type}
          onChange={(value) => handleInputChange('type', value || 'other')}
        />

        {/* Кнопки */}
        <Group justify="flex-end" mt="lg" gap="sm">
          <Button variant="subtle" color="gray" onClick={handleClose} size="sm">
            Отмена
          </Button>
          <Button
            color={isEdit ? 'blue' : 'indigo'}
            onClick={handleSubmit}
            size="sm"
            disabled={!contactData.name.trim() || !contactData.phones.trim()}
          >
            {isEdit ? 'Сохранить' : 'Создать'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
