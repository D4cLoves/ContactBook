import {
  Modal,
  Text,
  Badge,
  Stack,
  Avatar,
  Divider,
  Paper,
  ActionIcon,
} from '@mantine/core';
import Contact from '../Contact/Contact';
import {
  IconPhone,
  IconUser,
  IconX,
  IconBriefcase,
  IconUserCircle,
} from '@tabler/icons-react';
import styles from './ContactViewModal.module.css';

interface ContactViewModalProps {
  contact: Contact;
  onClose: () => void;
  opened: boolean;
}

export default function ContactViewModal({
  contact,
  onClose,
  opened,
}: ContactViewModalProps) {
  if (!contact) {
    return null;
  }

  const typeColors: Record<string, string> = {
    family: 'blue',
    work: 'cyan',
    friend: 'pink',
    other: 'gray',
  };

  const typeIcons: Record<string, any> = {
    family: IconUser,
    work: IconBriefcase,
    friend: IconUserCircle,
    other: IconUser,
  };

  const TypeIcon = typeIcons[contact.type.toLowerCase()] || IconUser;

  const generateAvatar = (name: string) => {
    return `https://i.pravatar.cc/150?u=${encodeURIComponent(name)}`;
  };

  const getFullName = () => {
    const parts = [contact.surname, contact.name, contact.patronymic].filter(
      Boolean
    );
    return parts.join(' ');
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title=""
      centered
      size="md"
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      styles={{
        header: { display: 'none' },
        body: { padding: 0 },
      }}
    >
      <div className={styles.modalContainer}>
        <ActionIcon
          variant="subtle"
          color="gray"
          size="lg"
          onClick={onClose}
          className={styles.closeButton}
        >
          <IconX size={20} />
        </ActionIcon>

        <div className={styles.avatarContainer}>
          <Avatar
            size={80}
            radius="xl"
            src={generateAvatar(contact.name)}
            className={styles.avatar}
          />

          <div className={styles.nameContainer}>
            <Text className={styles.contactName}>{getFullName()}</Text>

            <div className={styles.typeContainer}>
              <TypeIcon size={16} className={styles.typeIcon} />
              <Badge
                color={typeColors[contact.type.toLowerCase()] || 'gray'}
                variant="light"
                size="md"
                radius="md"
                className={styles.typeBadge}
              >
                {contact.type}
              </Badge>
            </div>
          </div>
        </div>

        <Divider className={styles.divider} />

        <Stack gap="md">
          <Text className={styles.sectionTitle}>Контактная информация</Text>

          <Paper className={styles.contactInfoCard}>
            <Stack gap="sm">
              {contact.phones.map((phone, index) => (
                <div key={index} className={styles.phoneItem}>
                  <div className={styles.phoneIconContainer}>
                    <IconPhone size={16} className={styles.phoneIcon} />
                  </div>
                  <Text className={styles.phoneNumber}>{phone}</Text>
                </div>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </div>
    </Modal>
  );
}
