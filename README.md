# ContactBook

Телефонная книга на React + TypeScript. Управление контактами с сохранением в localStorage.

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0.4-646CFF?logo=vite&logoColor=white)

## Скриншоты

<div align="center">

![Главный экран](./screenshots/main-view.png)
![Добавление контакта](./screenshots/add-contact.png)
![Редактирование контакта](./screenshots/editing-contact.png)
![Просмотр контакта](./screenshots/view-contact.png)

</div>

## Функциональность

- CRUD операции с контактами
- Поиск по имени и телефону
- Категории контактов (Работа, Семья, Друзья, Другое)
- Сохранение в localStorage
- Переключение темы (светлая/темная)
- Адаптивный дизайн

## Технологии

- React 19.1.0
- TypeScript 5.8.3
- Vite 7.0.4
- Mantine UI 8.2.1
- CSS Modules

## Установка и запуск

```bash
git clone https://github.com/D4cLoves/ContactBook.git
cd ContactBook
npm install
npm run dev
```

Откройте `http://localhost:5173`

## Архитектура

Проект использует:
- Кастомные хуки для логики состояния
- TypeScript классы для моделей данных
- CSS Modules для изолированных стилей
- Модульная структура компонентов

## Примеры кода

### 1. Кастомный хук useContacts

Управление состоянием контактов с автоматической синхронизацией localStorage:

```typescript:src/hooks/useContacts.ts
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
    
  // Загрузка из localStorage при монтировании
  useEffect(() => {
    const savedContactsStr = localStorage.getItem(STORAGE_KEY);
    if (savedContactsStr) {
      try {
        const savedContacts = JSON.parse(savedContactsStr);
        if (Array.isArray(savedContacts) && savedContacts.length > 0) {
          const contactsArr = savedContacts.map((c: any) => 
            new Contact(c.id, c.name, c.surname, c.patronymic, c.type, c.phones)
          );
          setContacts(contactsArr);
        }
      } catch (e) {
        console.error('Error parsing contacts from localStorage:', e);
      }
    }
  }, []);

  // Автоматическое сохранение при изменении
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  const addContact = (newContact: Contact) => {
    setContacts(prev => [...prev, newContact]);
  };

  const onDelete = (id: number) => {
    setContacts((prev) => {
      const updated = prev.filter(contact => contact.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const onEdit = (updatedContact: Contact) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  return { contacts, addContact, onDelete, onEdit };
}
```

**Что показывает:** Инкапсуляция логики работы с данными в переиспользуемый хук. Автоматическая синхронизация состояния с localStorage без дублирования кода.

### 2. Модель данных Contact

TypeScript класс с методами для работы с контактом:

```typescript:src/components/Contact/Contact.tsx
export default class Contact {
    id: number;
    name: string;
    surname: string;
    patronymic: string;
    type: string;
    phones: string[];

    constructor(
        id: number, 
        name: string, 
        surname: string, 
        patronymic: string, 
        type: string, 
        phones: string[]
    ) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.patronymic = patronymic;
        this.type = type;
        this.phones = phones;
    }

    update(name: string, surname: string, patronymic: string, type: string, phones: string[]) {
        this.name = name;
        this.surname = surname;
        this.patronymic = patronymic;
        this.type = type;
        this.phones = phones;
    }
}
```

**Что показывает:** Использование классов вместо простых объектов для моделей данных. Метод `update` инкапсулирует логику изменения контакта.

### 3. Фильтрация контактов

Реализация поиска в главном компоненте:

```typescript:src/App.tsx
const [searchQuery, setSearchQuery] = useState('');

const filteredContacts = contacts.filter((contact) => {
  const fullName = `${contact.surname} ${contact.name} ${contact.patronymic}`.toLowerCase();
  const phones = contact.phones.join(' ').toLowerCase();
  const query = searchQuery.toLowerCase();
  return fullName.includes(query) || phones.includes(query);
});
```

**Что показывает:** Простая и эффективная фильтрация данных на клиенте. Поиск работает по полному имени и всем телефонам одновременно.

## Структура проекта

```
src/
├── components/          # React компоненты
│   ├── AddContactModalPage/
│   ├── Contact/         # Модель контакта
│   ├── ContactViewModal/
│   ├── OnEditModalPage/
│   ├── RenderContacts/  # Таблица контактов
│   └── SearchContact/
├── hooks/
│   └── useContacts.ts   # Логика управления контактами
├── App.tsx              # Главный компонент
└── main.tsx             # Точка входа
```

## Автор

**D4cLoves**

- GitHub: [@D4cLoves](https://github.com/D4cLoves)
- Telegram: [@D4cLoves](https://t.me/D4cLoves)
