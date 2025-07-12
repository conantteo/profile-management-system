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
  IconReport,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { useState } from 'react';

// Mock data for report requests
const mockReportRequests = [
  {
    id: 'REQ-101',
    title: 'Annual Financial Report',
    requestedBy: 'John Doe',
    requestDate: new Date('2023-05-15'),
    status: 'pending',
    priority: 'high',
    reportType: 'financial',
    department: 'Finance',
  },
  {
    id: 'REQ-102',
    title: 'Q2 Marketing Analysis',
    requestedBy: 'Jane Smith',
    requestDate: new Date('2023-06-20'),
    status: 'approved',
    priority: 'medium',
    reportType: 'marketing',
    department: 'Marketing',
  },
  {
    id: 'REQ-103',
    title: 'Employee Satisfaction Survey',
    requestedBy: 'Robert Johnson',
    requestDate: new Date('2023-07-05'),
    status: 'rejected',
    priority: 'low',
    reportType: 'hr',
    department: 'Human Resources',
  },
  {
    id: 'REQ-104',
    title: 'Product Performance Analysis',
    requestedBy: 'Emily Brown',
    requestDate: new Date('2023-07-10'),
    status: 'pending',
    priority: 'medium',
    reportType: 'product',
    department: 'Product Development',
  },
  {
    id: 'REQ-105',
    title: 'Compliance Audit Report',
    requestedBy: 'Michael Wilson',
    requestDate: new Date('2023-07-15'),
    status: 'approved',
    priority: 'high',
    reportType: 'compliance',
    department: 'Legal',
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

// Report type options for the filter
const reportTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'financial', label: 'Financial' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'hr', label: 'HR' },
  { value: 'product', label: 'Product' },
  { value: 'compliance', label: 'Compliance' },
];

// Department options for the filter
const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Human Resources', label: 'Human Resources' },
  { value: 'Product Development', label: 'Product Development' },
  { value: 'Legal', label: 'Legal' },
];

export function ReportRequestsView() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [titleFilter, setTitleFilter] = useState('');
  const [requestedByFilter, setRequestedByFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>('all');
  const [reportTypeFilter, setReportTypeFilter] = useState<string | null>(
    'all'
  );
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(
    'all'
  );

  // Filter the requests based on the selected filters
  const filteredRequests = mockReportRequests.filter((request) => {
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

    // Report type filter
    if (reportTypeFilter !== 'all' && request.reportType !== reportTypeFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== 'all' && request.department !== departmentFilter) {
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
    setReportTypeFilter('all');
    setDepartmentFilter('all');
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Group justify="space-between">
          <Group>
            <IconReport size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Report Requests</Title>
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
                </Box>
                <TextInput
                  placeholder="Filter title..."
                  value={titleFilter}
                  onChange={(e) => setTitleFilter(e.currentTarget.value)}
                  size="xs"
                  mt="xs"
                />
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Requested By</Text>
                </Box>
                <TextInput
                  placeholder="Filter name..."
                  value={requestedByFilter}
                  onChange={(e) => setRequestedByFilter(e.currentTarget.value)}
                  size="xs"
                  mt="xs"
                />
              </Table.Th>
              <Table.Th>
                <Stack>
                  <Box style={{ position: 'relative' }}>
                    <Text size="md">Request Date</Text>
                  </Box>
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
              <Table.Th>
                <Box style={{ display: 'flex', alignItems: 'center' }}>
                  <Text>Status</Text>
                </Box>
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Priority</Text>
                </Box>
                <Select
                  placeholder="Filter priority..."
                  data={priorityOptions}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  size="xs"
                  mt="xs"
                />
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Report Type</Text>
                </Box>
                <Select
                  placeholder="Filter report type..."
                  data={reportTypeOptions}
                  value={reportTypeFilter}
                  onChange={setReportTypeFilter}
                  size="xs"
                  mt="xs"
                />
              </Table.Th>
              <Table.Th>
                <Box style={{ position: 'relative' }}>
                  <Text>Department</Text>
                </Box>
                <Select
                  placeholder="Filter department..."
                  data={departmentOptions}
                  value={departmentFilter}
                  onChange={setDepartmentFilter}
                  size="xs"
                  mt="xs"
                />
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
                <Table.Td>
                  {request.reportType.charAt(0).toUpperCase() +
                    request.reportType.slice(1)}
                </Table.Td>
                <Table.Td>{request.department}</Table.Td>
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
