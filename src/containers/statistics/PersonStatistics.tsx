import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Table,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual API call or prop
const personData = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Senior Software Engineer',
    company: 'Tech Corp',
    email: 'john.doe@techcorp.com',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    joinDate: 'January 2020',
  },
  {
    id: '2',
    name: 'Jane Smith',
    position: 'Product Manager',
    company: 'StartupXYZ',
    email: 'jane.smith@startupxyz.com',
    location: 'New York, NY',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    joinDate: 'January 2020',
  },
];

export function PersonStatistics() {
  const navigate = useNavigate();

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Group mb="md" align="center">
          <Title order={2}>Person Statistics</Title>
        </Group>
      </Card>
      <Box style={{ overflowX: 'auto', width: '100%' }}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{ minWidth: 1200 }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Join Date</Table.Th>
              <Table.Th
                style={{
                  position: 'sticky',
                  right: 0,
                  background: '#fff',
                  zIndex: 1,
                  minWidth: 100,
                }}
              >
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {personData.map((person) => (
              <Table.Tr id={person.id}>
                <Table.Td>{person.name}</Table.Td>
                <Table.Td>{person.position}</Table.Td>
                <Table.Td>{person.company}</Table.Td>
                <Table.Td>{person.email}</Table.Td>
                <Table.Td>{person.location}</Table.Td>
                <Table.Td>{person.phone}</Table.Td>
                <Table.Td>{person.department}</Table.Td>
                <Table.Td>{person.joinDate}</Table.Td>
                <Table.Td
                  style={{
                    position: 'sticky',
                    right: 0,
                    background: '#fff',
                    zIndex: 1,
                    minWidth: 100,
                  }}
                >
                  <Button
                    onClick={() => navigate(`/profile/person/${person.id}`)}
                    variant="filled"
                    size="xs"
                  >
                    Open
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Container>
  );
}
