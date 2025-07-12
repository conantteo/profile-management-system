import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Menu,
  MultiSelect,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconMap,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

// Mock data for map requests
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
  },
  {
    id: 'REQ-004',
    title: 'Historical Map 1950',
    requestedBy: 'Emily Brown',
    requestDate: new Date('2023-07-10'),
    status: 'pending',
    priority: 'medium',
    mapType: 'historical',
    scale: '1:25,000',
  },
  {
    id: 'REQ-005',
    title: 'National Parks Map',
    requestedBy: 'Michael Wilson',
    requestDate: new Date('2023-07-15'),
    status: 'approved',
    priority: 'high',
    mapType: 'physical',
    scale: '1:100,000',
  },
];

// Status options for the filter
const statusOptions = [
  { value: 'all', label: 'Select All' },
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

// Map type options for the filter
const mapTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'political', label: 'Political' },
  { value: 'topographic', label: 'Topographic' },
  { value: 'road', label: 'Road' },
  { value: 'historical', label: 'Historical' },
  { value: 'physical', label: 'Physical' },
];

// Define fixed column widths
const COLUMN_WIDTHS = {
  id: 120,
  title: 200,
  requestedBy: 180,
  requestDate: 160,
  status: 120,
  priority: 150,
  mapType: 140,
  scale: 120,
  actions: 100,
};

export function MapRequestsView() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [titleFilter, setTitleFilter] = useState('');
  const [requestedByFilter, setRequestedByFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [mapTypeFilter, setMapTypeFilter] = useState<string | null>('all');
  const [scaleFilter, setScaleFilter] = useState('');

  // Filter the requests based on the selected filters
  const filteredRequests = mockMapRequests.filter((request) => {
    // Status filter
    if (
      statusFilter.length > 0 &&
      !statusFilter.includes('all') &&
      !statusFilter.includes(request.status)
    ) {
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
    if (
      priorityFilter.length > 0 &&
      !priorityFilter.includes('all') &&
      !priorityFilter.includes(request.priority)
    ) {
      return false;
    }

    // Map type filter
    if (mapTypeFilter !== 'all' && request.mapType !== mapTypeFilter) {
      return false;
    }

    // Scale filter
    if (scaleFilter && !request.scale.includes(scaleFilter)) {
      return false;
    }

    return true;
  });

  // Reset all filters
  const resetFilters = () => {
    setStatusFilter([]);
    setTitleFilter('');
    setRequestedByFilter('');
    setDateFilter(null);
    setPriorityFilter([]);
    setMapTypeFilter('all');
    setScaleFilter('');
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Stack>
          {/* Title and Icon */}
          <Group>
            <IconMap size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Map Requests</Title>
          </Group>
          {/* Filters */}
          <Flex justify="space-between">
            <Group flex={1}>
              <Text fw={500}>Filter by Status:</Text>
              <MultiSelect
                data={statusOptions}
                value={statusFilter}
                onChange={(selectedValues) => {
                  // Handle "Select All" option
                  if (selectedValues.includes('all')) {
                    // If "Select All" is selected, include all status options except "all"
                    if (statusFilter.length !== statusOptions.length - 1) {
                      setStatusFilter(
                        statusOptions
                          .filter((option) => option.value !== 'all')
                          .map((option) => option.value)
                      );
                    } else {
                      // If all options were already selected, deselect all
                      setStatusFilter([]);
                    }
                  } else {
                    setStatusFilter(selectedValues);
                  }
                }}
                style={{ width: 250 }}
                searchable
                clearable
                placeholder="Select statuses"
                nothingFoundMessage="No matching statuses"
              />
              {/* Add other filter controls here if needed */}
            </Group>
            <Group>
              <Button
                variant="subtle"
                leftSection={<IconX size={16} />}
                onClick={resetFilters}
              >
                Reset All Filters
              </Button>
              <Button variant="outline">Export</Button>
            </Group>
          </Flex>
        </Stack>
      </Card>

      {/* Table Container with horizontal scroll */}
      <Box
        style={{
          position: 'relative',
          border: '1px solid var(--mantine-color-gray-3)',
          borderRadius: 'var(--mantine-radius-md)',
          backgroundColor: 'white',
        }}
      >
        <Box
          style={{
            width: '100%',
            maxWidth: 'calc(100vw - 88px)',
            overflowX: 'auto',
            overflowY: 'hidden',
            position: 'relative',
          }}
        >
          <Table
            striped
            highlightOnHover
            withTableBorder={false}
            withColumnBorders
            style={{
              borderCollapse: 'separate',
              borderSpacing: 0,
            }}
          >
            <Table.Thead
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 10,
                backgroundColor: 'var(--mantine-color-gray-0)',
              }}
            >
              <Table.Tr>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.id,
                    minWidth: COLUMN_WIDTHS.id,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>ID</Text>
                    <Box style={{ height: '30px' }}></Box>
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.title,
                    minWidth: COLUMN_WIDTHS.title,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Title</Text>
                    <TextInput
                      placeholder="Filter title..."
                      value={titleFilter}
                      onChange={(e) => setTitleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.requestedBy,
                    minWidth: COLUMN_WIDTHS.requestedBy,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Requested By</Text>
                    <TextInput
                      placeholder="Filter name..."
                      value={requestedByFilter}
                      onChange={(e) =>
                        setRequestedByFilter(e.currentTarget.value)
                      }
                      size="xs"
                    />
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.requestDate,
                    minWidth: COLUMN_WIDTHS.requestDate,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Request Date</Text>
                    <DatePickerInput
                      placeholder="Filter date..."
                      value={dateFilter}
                      onChange={(value) =>
                        setDateFilter(value ? new Date(value) : null)
                      }
                      size="xs"
                      clearable
                    />
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.status,
                    minWidth: COLUMN_WIDTHS.status,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Status</Text>
                    <Box style={{ height: '30px' }}></Box>
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.priority,
                    minWidth: COLUMN_WIDTHS.priority,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Priority</Text>
                    <MultiSelect
                      data={priorityOptions}
                      value={priorityFilter}
                      onChange={(selectedValues) => {
                        // Handle "Select All" option
                        if (selectedValues.includes('all')) {
                          // If "Select All" is selected, include all priority options except "all"
                          if (
                            priorityFilter.length !==
                            priorityOptions.length - 1
                          ) {
                            setPriorityFilter(
                              priorityOptions
                                .filter((option) => option.value !== 'all')
                                .map((option) => option.value)
                            );
                          } else {
                            // If all options were already selected, deselect all
                            setPriorityFilter([]);
                          }
                        } else {
                          setPriorityFilter(selectedValues);
                        }
                      }}
                      size="xs"
                      searchable
                      clearable
                      nothingFoundMessage="No matching priorities"
                      placeholder={
                        priorityFilter.length > 0
                          ? `${priorityFilter.length} selected`
                          : 'Filter priority...'
                      }
                      styles={{
                        pill: { display: 'none' },
                        input: { minHeight: '28px' },
                      }}
                    />
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.mapType,
                    minWidth: COLUMN_WIDTHS.mapType,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Map Type</Text>
                    <Select
                      placeholder="Filter map type..."
                      data={mapTypeOptions}
                      value={mapTypeFilter}
                      onChange={setMapTypeFilter}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.scale,
                    minWidth: COLUMN_WIDTHS.scale,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Scale</Text>
                    <TextInput
                      placeholder="Filter scale..."
                      value={scaleFilter}
                      onChange={(e) => setScaleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>

                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.scale,
                    minWidth: COLUMN_WIDTHS.scale,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Scale</Text>
                    <TextInput
                      placeholder="Filter scale..."
                      value={scaleFilter}
                      onChange={(e) => setScaleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>

                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.scale,
                    minWidth: COLUMN_WIDTHS.scale,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Scale</Text>
                    <TextInput
                      placeholder="Filter scale..."
                      value={scaleFilter}
                      onChange={(e) => setScaleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>

                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.scale,
                    minWidth: COLUMN_WIDTHS.scale,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Scale</Text>
                    <TextInput
                      placeholder="Filter scale..."
                      value={scaleFilter}
                      onChange={(e) => setScaleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>

                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.scale,
                    minWidth: COLUMN_WIDTHS.scale,
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Scale</Text>
                    <TextInput
                      placeholder="Filter scale..."
                      value={scaleFilter}
                      onChange={(e) => setScaleFilter(e.currentTarget.value)}
                      size="xs"
                    />
                  </Stack>
                </Table.Th>
                {/* Sticky Actions Column */}
                <Table.Th
                  style={{
                    width: COLUMN_WIDTHS.actions,
                    minWidth: COLUMN_WIDTHS.actions,
                    position: 'sticky',
                    right: 0,
                    backgroundColor: 'var(--mantine-color-gray-0)',
                    zIndex: 11,
                    borderLeft: '1px solid var(--mantine-color-gray-3)',
                  }}
                >
                  <Stack gap="xs">
                    <Text fw={600}>Actions</Text>
                    <Box style={{ height: '30px' }}></Box>
                  </Stack>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredRequests.map((request) => (
                <Table.Tr key={request.id}>
                  <Table.Td style={{ width: COLUMN_WIDTHS.id }}>
                    <Text truncate>{request.id}</Text>
                  </Table.Td>
                  <Table.Td style={{ width: COLUMN_WIDTHS.title }}>
                    <Text truncate title={request.title}>
                      {request.title}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ width: COLUMN_WIDTHS.requestedBy }}>
                    <Text truncate title={request.requestedBy}>
                      {request.requestedBy}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ width: COLUMN_WIDTHS.requestDate }}>
                    <Text truncate>
                      {request.requestDate.toLocaleDateString()}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ width: COLUMN_WIDTHS.status }}>
                    <Text
                      fw={500}
                      truncate
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
                  <Table.Td style={{ width: COLUMN_WIDTHS.priority }}>
                    <Text
                      fw={500}
                      truncate
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
                  <Table.Td style={{ width: COLUMN_WIDTHS.mapType }}>
                    <Text truncate>
                      {request.mapType.charAt(0).toUpperCase() +
                        request.mapType.slice(1)}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ width: COLUMN_WIDTHS.scale }}>
                    <Text truncate>{request.scale}</Text>
                  </Table.Td>

                  <Table.Td style={{ width: COLUMN_WIDTHS.scale }}>
                    <Text truncate>{request.scale}</Text>
                  </Table.Td>

                  <Table.Td style={{ width: COLUMN_WIDTHS.scale }}>
                    <Text truncate>{request.scale}</Text>
                  </Table.Td>

                  <Table.Td style={{ width: COLUMN_WIDTHS.scale }}>
                    <Text truncate>{request.scale}</Text>
                  </Table.Td>

                  <Table.Td style={{ width: COLUMN_WIDTHS.scale }}>
                    <Text truncate>{request.scale}</Text>
                  </Table.Td>
                  {/* Sticky Actions Column */}
                  <Table.Td
                    style={{
                      width: COLUMN_WIDTHS.actions,
                      position: 'sticky',
                      right: 0,
                      backgroundColor: 'white',
                      zIndex: 1,
                      borderLeft: '1px solid var(--mantine-color-gray-3)',
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
      </Box>
    </Container>
  );
}
