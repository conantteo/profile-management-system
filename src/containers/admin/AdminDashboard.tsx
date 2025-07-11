import { Container, Title, Text, Card, Button, Stack, Group, SimpleGrid } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconDatabase, IconShield, IconHome } from '@tabler/icons-react';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={1}>Admin Dashboard</Title>
          <Button variant="outline" onClick={() => navigate('/')}>
            <IconHome size={16} style={{ marginRight: 8 }} />
            Home
          </Button>
        </Group>
        
        <Text size="lg" c="dimmed">
          Administrative panel for system management
        </Text>
        
        <SimpleGrid cols={2} spacing="lg">
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/entity-console')}
          >
            <Stack align="center" gap="md">
              <IconDatabase size={50} color="blue" />
              <div style={{ textAlign: 'center' }}>
                <Text fw={500} size="lg">Entity Console</Text>
                <Text size="sm" c="dimmed">
                  Manage database entities and configurations
                </Text>
              </div>
              <Button variant="light" fullWidth>
                Open Console
              </Button>
            </Stack>
          </Card>
          
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/access-control')}
          >
            <Stack align="center" gap="md">
              <IconShield size={50} color="green" />
              <div style={{ textAlign: 'center' }}>
                <Text fw={500} size="lg">Access Control</Text>
                <Text size="sm" c="dimmed">
                  Manage user permissions and security
                </Text>
              </div>
              <Button variant="light" fullWidth>
                Manage Access
              </Button>
            </Stack>
          </Card>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
