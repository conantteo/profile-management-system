import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Menu,
  Select,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFilter,
  IconTrash,
  IconWorld,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

// Mock data for country requests
const mockCountryRequests = [
  {
    id: 'REQ-201',
    title: 'United States Profile Update',
    requestedBy: 'John Doe',
    requestDate: new Date('2023-05-15'),
    status: 'pending',
    priority: 'high',
    region: 'North America',
    population: '331 million',
  },
  {
    id: 'REQ-202',
    title: 'Germany Economic Data',
    requestedBy: 'Jane Smith',
    requestDate: new Date('2023-06-20'),
    status: 'approved',
    priority: 'medium',
    region: 'Europe',
    population: '83 million',
  },
  {
    id: 'REQ-203',
    title: 'Japan Cultural Information',
    requestedBy: 'Robert Johnson',
    requestDate: new Date('2023-07-05'),
    status: 'rejected',
    priority: 'low',
    region: 'Asia',
    population: '126 million',
  },
  {
    id: 'REQ-204',
    title: 'Brazil Geographic Data',
    requestedBy: 'Emily Brown',
    requestDate: new Date('2023-07-10'),
    status: 'pending',
    priority: 'medium',
    region: 'South America',
    population: '212 million',
  },
  {
    id: 'REQ-205',
    title: 'South Africa Political Structure',
    requestedBy: 'Michael Wilson',
    requestDate: new Date('2023-07-15'),
    status: 'approved',
    priority: 'high',
    region: 'Africa',
    population: '59 million',
  },
];

// Status options for the filter
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

// Priority options for the filter
const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

// Region options for the filter
const regionOptions = [
  { value: 'all', label: 'All Regions' },
  { value: 'North America', label: 'North America' },
  { value: 'South America', label: 'South America' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Oceania', label: 'Oceania' },
];

export function CountryRequestsView() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [titleFilter, setTitleFilter] = useState('');
  const [requestedByFilter, setRequestedByFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>('all');
  const [regionFilter, setRegionFilter] = useState<string | null>('all');
  const [populationFilter, setPopulationFilter] = useState('');

  // State for column filters visibility
  const [showTitleFilter, { toggle: toggleTitleFilter }] = useDisclosure(true);
  const [showRequestedByFilter, { toggle: toggleRequestedByFilter }] =
    useDisclosure(true);
  const [showDateFilter, { toggle: toggleDateFilter }] = useDisclosure(true);
  const [showPriorityFilter, { toggle: togglePriorityFilter }] =
    useDisclosure(true);
  const [showRegionFilter, { toggle: toggleRegionFilter }] =
    useDisclosure(true);
  const [showPopulationFilter, { toggle: togglePopulationFilter }] =
    useDisclosure(true);

  // Filter the requests based on the selected filters
  const filteredRequests = mockCountryRequests.filter((request) => {
    // Status filter
    if (statusFilter !== 'all' && request.status !== statusFilter) {
      return false;
    }

    // Title filter
    if (
      titleFilter &&
      !request.title.toLowerCase().includes(titleFilter.toLowerCase())
    ) {
      return false;
    }

    // Requested by filter
    if (
      requestedByFilter &&
      !request.requestedBy
        .toLowerCase()
        .includes(requestedByFilter.toLowerCase())
    ) {
      return false;
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      const requestDate = new Date(request.requestDate);

      if (
        filterDate.getFullYear() !== requestDate.getFullYear() ||
        filterDate.getMonth() !== requestDate.getMonth() ||
        filterDate.getDate() !== requestDate.getDate()
      ) {
        return false;
      }
    }

    // Priority filter
    if (priorityFilter !== 'all' && request.priority !== priorityFilter) {
      return false;
    }

    // Region filter
    if (regionFilter !== 'all' && request.region !== regionFilter) {
      return false;
    }

    // Population filter
    if (populationFilter && !request.population.includes(populationFilter)) {
      return false;
    }

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter('all');
    setTitleFilter('');
    setRequestedByFilter('');
    setDateFilter(null);
    setPriorityFilter('all');
    setRegionFilter('all');
    setPopulationFilter('');
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between">
          <Group>
            <IconWorld size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Country Requests</Title>
          </Group>
          <Button variant="outline">Export</Button>
        </Group>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Flex gap="md" align="center" wrap="wrap">
          <Text fw={500}>Filter by Status:</Text>
          <Select
            data={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
          />
          <Button
            variant="subtle"
            leftSection={<IconX size={16} />}
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </Flex>
      </Card>

      <Box style={{ overflowX: 'auto' }}>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>ID</Text>
                </Box>
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Title</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={toggleTitleFilter}
                    aria-label="Filter title"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showTitleFilter && (
                  <TextInput
                    placeholder="Filter title..."
                    value={titleFilter}
                    onChange={(e) => setTitleFilter(e.currentTarget.value)}
                    size="xs"
                    mt="xs"
                  />
                )}
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Requested By</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={toggleRequestedByFilter}
                    aria-label="Filter requested by"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showRequestedByFilter && (
                  <TextInput
                    placeholder="Filter name..."
                    value={requestedByFilter}
                    onChange={(e) =>
                      setRequestedByFilter(e.currentTarget.value)
                    }
                    size="xs"
                    mt="xs"
                  />
                )}
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Request Date</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={toggleDateFilter}
                    aria-label="Filter date"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showDateFilter && (
                  <DatePickerInput
                    placeholder="Filter date..."
                    value={dateFilter}
                    onChange={(value) =>
                      setDateFilter(value ? new Date(value) : null)
                    }
                    size="xs"
                    mt="xs"
                    clearable
                  />
                )}
              </Table.Th>
              <Table.Th>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>Status</Text>
                </Box>
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Priority</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={togglePriorityFilter}
                    aria-label="Filter priority"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showPriorityFilter && (
                  <Select
                    placeholder="Filter priority..."
                    data={priorityOptions}
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                    size="xs"
                    mt="xs"
                  />
                )}
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Region</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={toggleRegionFilter}
                    aria-label="Filter region"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showRegionFilter && (
                  <Select
                    placeholder="Filter region..."
                    data={regionOptions}
                    value={regionFilter}
                    onChange={setRegionFilter}
                    size="xs"
                    mt="xs"
                  />
                )}
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Population</Text>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={togglePopulationFilter}
                    aria-label="Filter population"
                    style={{ position: 'absolute', right: 0, bottom: 0 }}
                  >
                    <IconFilter size={16} />
                  </ActionIcon>
                </Box>
                {showPopulationFilter && (
                  <TextInput
                    placeholder="Filter population..."
                    value={populationFilter}
                    onChange={(e) => setPopulationFilter(e.currentTarget.value)}
                    size="xs"
                    mt="xs"
                  />
                )}
              </Table.Th>
              <Table.Th
                style={{
                  position: 'sticky',
                  right: 0,
                  background: 'white',
                  zIndex: 1,
                }}
              >
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>Actions</Text>
                </Box>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredRequests.map((request) => (
              <Table.Tr key={request.id}>
                <Table.Td>{request.id}</Table.Td>
                <Table.Td>{request.title}</Table.Td>
                <Table.Td>{request.requestedBy}</Table.Td>
                <Table.Td>{request.requestDate.toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Text
                    fw={500}
                    c={
                      request.status === 'approved'
                        ? 'green'
                        : request.status === 'rejected'
                          ? 'red'
                          : 'orange'
                    }
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text
                    fw={500}
                    c={
                      request.priority === 'high'
                        ? 'red'
                        : request.priority === 'medium'
                          ? 'orange'
                          : 'green'
                    }
                  >
                    {request.priority.charAt(0).toUpperCase() +
                      request.priority.slice(1)}
                  </Text>
                </Table.Td>
                <Table.Td>{request.region}</Table.Td>
                <Table.Td>{request.population}</Table.Td>
                <Table.Td
                  style={{
                    position: 'sticky',
                    right: 0,
                    background: 'white',
                    zIndex: 1,
                  }}
                >
                  <Menu position="bottom-end" withArrow shadow="md">
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item leftSection={<IconEye size={14} />}>
                        View Details
                      </Menu.Item>
                      <Menu.Item leftSection={<IconEdit size={14} />}>
                        Edit Request
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                      >
                        Delete Request
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Box>
    </Container>
  );
}
