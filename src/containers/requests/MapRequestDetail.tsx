import {
  Badge,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconCheck,
  IconClipboardList,
  IconMap,
  IconUser,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

// Mock data for map requests with more details
const mockMapRequests = [
  {
    id: 'REQ-001',
    title: 'World Map 2023',
    requestedBy: 'John Doe',
    requestDate: new Date('2023-05-15'),
    status: 'pending',
    priority: 'high',
    mapType: 'political',
    scale: '1:10,000',
    description:
      'A detailed political world map showing country boundaries, capitals, and major cities.',
    purpose: 'Educational use in schools and universities',
    requiredFormat: 'PDF and JPEG',
    dimensions: '36" x 24"',
    specialInstructions:
      'Include disputed territories with dotted lines. Use standard color scheme for political maps.',
    deadline: new Date('2023-08-15'),
    additionalNotes:
      'This map will be used in a new geography textbook. High resolution is required.',
    submittedFiles: [
      { name: 'reference_map.jpg', size: '2.4 MB' },
      { name: 'color_scheme.pdf', size: '1.1 MB' },
    ],
  },
  {
    id: 'REQ-002',
    title: 'Europe Regional Map',
    requestedBy: 'Jane Smith',
    requestDate: new Date('2023-06-20'),
    status: 'approved',
    priority: 'medium',
    mapType: 'topographic',
    scale: '1:50,000',
    description:
      'A topographic map of Europe showing elevation, rivers, and major geographical features.',
    purpose: 'Research project on European geography',
    requiredFormat: 'PDF and GIS compatible format',
    dimensions: '42" x 30"',
    specialInstructions:
      'Include detailed elevation contours. Highlight major mountain ranges.',
    deadline: new Date('2023-09-10'),
    additionalNotes:
      'This map will be used for a research project on European geography. Include data sources in the map legend.',
    submittedFiles: [
      { name: 'europe_reference.jpg', size: '3.1 MB' },
      { name: 'elevation_data.zip', size: '15.7 MB' },
    ],
  },
  {
    id: 'REQ-003',
    title: 'City Center Map',
    requestedBy: 'Robert Johnson',
    requestDate: new Date('2023-07-05'),
    status: 'rejected',
    priority: 'low',
    mapType: 'road',
    scale: '1:5,000',
    description:
      'A detailed road map of the city center showing streets, buildings, and points of interest.',
    purpose: 'Tourist information guide',
    requiredFormat: 'PDF and PNG',
    dimensions: '24" x 18"',
    specialInstructions:
      'Highlight tourist attractions and public transportation. Use bright colors.',
    deadline: new Date('2023-08-01'),
    additionalNotes:
      'This map will be used for a tourist information guide. Make it visually appealing and easy to read.',
    submittedFiles: [
      { name: 'city_reference.jpg', size: '2.8 MB' },
      { name: 'poi_data.xlsx', size: '1.3 MB' },
    ],
  },
];

// Mock person data related to the request
const mockPersonData = [
  {
    id: 'P001',
    name: 'John Doe',
    role: 'Requester',
    department: 'Geography Department',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    isExactMatch: true,
  },
  {
    id: 'P002',
    name: 'Jane Smith',
    role: 'Cartographer',
    department: 'Map Production',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    isExactMatch: false,
  },
  {
    id: 'P003',
    name: 'Robert Johnson',
    role: 'Reviewer',
    department: 'Quality Control',
    email: 'robert.johnson@example.com',
    phone: '+1 (555) 456-7890',
    isExactMatch: false,
  },
  {
    id: 'P004',
    name: 'Emily Brown',
    role: 'Project Manager',
    department: 'Production Management',
    email: 'emily.brown@example.com',
    phone: '+1 (555) 234-5678',
    isExactMatch: false,
  },
  {
    id: 'P005',
    name: 'Michael Wilson',
    role: 'GIS Specialist',
    department: 'Technical Support',
    email: 'michael.wilson@example.com',
    phone: '+1 (555) 876-5432',
    isExactMatch: false,
  },
];

// Checklist items
const initialChecklistItems = [
  { id: 1, label: 'Verify requester information', checked: false },
  { id: 2, label: 'Check map specifications', checked: false },
  { id: 3, label: 'Review reference materials', checked: false },
  { id: 4, label: 'Confirm deadline feasibility', checked: false },
  { id: 5, label: 'Assess technical requirements', checked: false },
  { id: 6, label: 'Validate format specifications', checked: false },
  { id: 7, label: 'Check for missing information', checked: false },
  { id: 8, label: 'Verify copyright compliance', checked: false },
];

export function MapRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const [checklistItems, setChecklistItems] = useState(initialChecklistItems);

  // Find the request based on the ID from the URL
  const request =
    mockMapRequests.find((req) => req.id === id) || mockMapRequests[0];

  // Sort person data to show exact matches first
  const sortedPersonData = [...mockPersonData].sort((a, b) => {
    if (a.isExactMatch && !b.isExactMatch) return -1;
    if (!a.isExactMatch && b.isExactMatch) return 1;
    return 0;
  });

  // Handle checklist item toggle
  const toggleChecklistItem = (itemId: number) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Determine which action buttons to show based on status
  const renderActionButtons = () => {
    switch (request.status) {
      case 'pending':
        return (
          <Group>
            <Button color="green">Approve</Button>
            <Button color="red">Reject</Button>
            <Button variant="outline">Request More Information</Button>
          </Group>
        );
      case 'approved':
        return (
          <Group>
            <Button color="blue">Assign to Team</Button>
            <Button variant="outline">View Production Status</Button>
          </Group>
        );
      case 'rejected':
        return (
          <Group>
            <Button color="orange">Reconsider</Button>
            <Button variant="outline">Archive</Button>
          </Group>
        );
      default:
        return null;
    }
  };

  return (
    <Container fluid py="xl">
      {/* Header */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Group>
          <IconMap size={32} color="var(--mantine-color-green-6)" />
          <Stack gap={0}>
            <Title order={2}>Map Request: {request.title}</Title>
            <Text c="dimmed">ID: {request.id}</Text>
          </Stack>
          <Badge
            size="lg"
            variant="filled"
            color={
              request.status === 'approved'
                ? 'green'
                : request.status === 'rejected'
                  ? 'red'
                  : 'orange'
            }
            ml="auto"
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </Group>
      </Card>

      {/* Main content with 3 columns */}
      <Grid gutter="md">
        {/* Left column: Person data */}
        <Grid.Col span={3} style={{ display: 'flex', flexDirection: 'column' }}>
          <Paper
            shadow="sm"
            p="md"
            radius="md"
            withBorder
            style={{
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            <Stack>
              <Group>
                <IconUser size={24} />
                <Title order={3}>Related Personnel</Title>
              </Group>
              <Divider />

              {sortedPersonData.map((person) => (
                <Card
                  key={person.id}
                  shadow="xs"
                  padding="md"
                  radius="md"
                  withBorder
                  style={{
                    borderLeft: person.isExactMatch
                      ? '4px solid var(--mantine-color-green-6)'
                      : undefined,
                    backgroundColor: person.isExactMatch
                      ? 'var(--mantine-color-green-0)'
                      : undefined,
                  }}
                >
                  <Stack gap="xs">
                    <Group>
                      <Title order={4}>{person.name}</Title>
                      {person.isExactMatch && (
                        <Badge color="green">Requester</Badge>
                      )}
                    </Group>
                    <Text>
                      <strong>Role:</strong> {person.role}
                    </Text>
                    <Text>
                      <strong>Department:</strong> {person.department}
                    </Text>
                    <Text>
                      <strong>Email:</strong> {person.email}
                    </Text>
                    <Text>
                      <strong>Phone:</strong> {person.phone}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Middle column: Request details */}
        <Grid.Col span={6}>
          <Paper p="md" radius="md">
            <Stack>
              <Group>
                <IconMap size={24} />
                <Title order={3}>Request Details</Title>
              </Group>
              <Divider />

              <List spacing="md">
                <List.Item>
                  <Text>
                    <strong>Title:</strong> {request.title}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Requested By:</strong> {request.requestedBy}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Request Date:</strong>{' '}
                    {request.requestDate.toLocaleDateString()}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Priority:</strong>
                    <Text
                      span
                      fw={500}
                      c={
                        request.priority === 'high'
                          ? 'red'
                          : request.priority === 'medium'
                            ? 'orange'
                            : 'green'
                      }
                    >
                      {' ' +
                        request.priority.charAt(0).toUpperCase() +
                        request.priority.slice(1)}
                    </Text>
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Map Type:</strong>{' '}
                    {request.mapType.charAt(0).toUpperCase() +
                      request.mapType.slice(1)}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Scale:</strong> {request.scale}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Description:</strong> {request.description}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Purpose:</strong> {request.purpose}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Required Format:</strong> {request.requiredFormat}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Dimensions:</strong> {request.dimensions}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Special Instructions:</strong>{' '}
                    {request.specialInstructions}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Deadline:</strong>{' '}
                    {request.deadline.toLocaleDateString()}
                  </Text>
                </List.Item>
                <List.Item>
                  <Text>
                    <strong>Additional Notes:</strong> {request.additionalNotes}
                  </Text>
                </List.Item>
              </List>

              <Divider label="Submitted Files" labelPosition="center" />

              <List spacing="md">
                {request.submittedFiles.map((file, index) => (
                  <List.Item key={index}>
                    <Group>
                      <Text>{file.name}</Text>
                      <Text c="dimmed">({file.size})</Text>
                      <Button variant="subtle" size="xs" ml="auto">
                        Download
                      </Button>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Right column: Checklist */}
        <Grid.Col span={3}>
          <Paper shadow="sm" p="md" radius="md" withBorder>
            <Stack>
              <Group>
                <IconClipboardList size={24} />
                <Title order={3}>Verification Checklist</Title>
              </Group>
              <Divider />

              <Stack>
                {checklistItems.map((item) => (
                  <Checkbox
                    key={item.id}
                    label={item.label}
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    size="md"
                    icon={IconCheck}
                  />
                ))}
              </Stack>

              <Divider my="md" />

              <Group justify="space-between">
                <Text>Progress:</Text>
                <Text fw={500}>
                  {checklistItems.filter((item) => item.checked).length} /{' '}
                  {checklistItems.length}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Group mt="xl" justify="flex-end">
        {renderActionButtons()}
      </Group>
    </Container>
  );
}
