import { Container, Title, Text, Card, Button, Stack, Group, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconShield, IconUsers, IconKey } from '@tabler/icons-react';

export function AccessControl() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Access Control</Title>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </Group>
        
        <Text size="lg" c="dimmed">
          Manage user permissions and access levels
        </Text>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <IconUsers size={40} color="green" />
            <div>
              <Text fw={500}>User Management</Text>
              <Text size="sm" c="dimmed">
                Add, edit, and remove users from the system
              </Text>
              <Badge color="green" variant="light" size="sm" mt="xs">
                Active
              </Badge>
            </div>
          </Group>
        </Card>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <IconShield size={40} color="blue" />
            <div>
              <Text fw={500}>Role Management</Text>
              <Text size="sm" c="dimmed">
                Define and assign user roles and permissions
              </Text>
              <Badge color="blue" variant="light" size="sm" mt="xs">
                Configured
              </Badge>
            </div>
          </Group>
        </Card>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <IconKey size={40} color="orange" />
            <div>
              <Text fw={500}>API Keys</Text>
              <Text size="sm" c="dimmed">
                Generate and manage API access keys
              </Text>
              <Badge color="orange" variant="light" size="sm" mt="xs">
                Secure
              </Badge>
            </div>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
