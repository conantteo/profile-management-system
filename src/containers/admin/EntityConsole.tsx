import { Container, Title, Text, Card, Button, Stack, Group } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconDatabase, IconSettings } from '@tabler/icons-react';

export function EntityConsole() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Entity Console</Title>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Admin
          </Button>
        </Group>
        
        <Text size="lg" c="dimmed">
          Manage and configure system entities
        </Text>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <IconDatabase size={40} color="blue" />
            <div>
              <Text fw={500}>Database Entities</Text>
              <Text size="sm" c="dimmed">
                Create, update, and delete database entities
              </Text>
            </div>
          </Group>
        </Card>
        
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group gap="md">
            <IconSettings size={40} color="orange" />
            <div>
              <Text fw={500}>Entity Configuration</Text>
              <Text size="sm" c="dimmed">
                Configure entity properties and relationships
              </Text>
            </div>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
}
