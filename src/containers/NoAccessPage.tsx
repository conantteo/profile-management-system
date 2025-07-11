import { Container, Title, Text, Button, Stack, Alert } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';

export function NoAccessPage() {
  const navigate = useNavigate();

  return (
    <Container size="xl" py="xl">
      <Stack align="center" gap="lg">
        <Alert
          variant="light"
          color="red"
          title="Access Denied"
          icon={<IconAlertCircle size={16} />}
          w="100%"
        >
          You don't have permission to access this resource.
        </Alert>
        
        <Title order={1} ta="center" c="red">
          Forbidden Access
        </Title>
        
        <Text size="lg" ta="center" c="dimmed">
          You are not authorized to view this page. Please contact your administrator if you believe this is an error.
        </Text>
        
        <Button onClick={() => navigate('/')}>
          Return to Main Page
        </Button>
      </Stack>
    </Container>
  );
}
