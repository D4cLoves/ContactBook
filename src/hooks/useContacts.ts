import { useState, useEffect } from "react";
import Contact from "../components/Contact/Contact";

const STORAGE_KEY = 'contacts';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
    
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
