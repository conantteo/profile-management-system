import { Avatar, Flex, Group, Paper, Stack, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

export interface IChatMessage {
  id: number;
  type: 'user' | 'system';
  author: string;
  timestamp: Date;
  message: string;
  avatar?: string | null;
}

interface ChatMessageProps {
  message: IChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isSystem = message.type === 'system';

  return (
    <Flex gap="sm" mb="md" align="flex-start">
      <Avatar
        size="sm"
        radius="xl"
        src={isSystem ? message.avatar : null}
        color={isSystem ? 'blue' : 'gray'}
      >
        {!isSystem && <IconUser size={16} />}
      </Avatar>

      <Stack gap="xs" style={{ flex: 1 }}>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            {message.author}
          </Text>
          <Text size="xs" c="dimmed">
            {message.timestamp.toLocaleString()}
          </Text>
        </Group>

        <Paper
          p="sm"
          radius="md"
          bg={isSystem ? 'blue.0' : 'gray.0'}
          style={{ maxWidth: '80%' }}
        >
          <Text size="sm">{message.message}</Text>
        </Paper>
      </Stack>
    </Flex>
  );
};
