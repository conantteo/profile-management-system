import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Divider,
  Group,
  Menu,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconFilter,
  IconSearch,
  IconShield,
  IconTrash,
  IconUserPlus,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock interfaces
interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface Group {
  id: string;
  name: string;
  kind: string;
  type: string;
  description: string;
}

interface UserRole {
  userId: string;
  roleId: string;
}

interface UserGroup {
  userId: string;
  groupId: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    department: 'Marketing',
    status: 'active',
  },
  {
    id: 'user3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    department: 'Finance',
    status: 'active',
  },
  {
    id: 'user4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    department: 'Human Resources',
    status: 'active',
  },
  {
    id: 'user5',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    department: 'Engineering',
    status: 'inactive',
  },
  {
    id: 'user6',
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    department: 'Marketing',
    status: 'active',
  },
];

const mockRoles: Role[] = [
  {
    id: 'role1',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['read', 'write', 'delete', 'admin'],
  },
  {
    id: 'role2',
    name: 'Editor',
    description: 'Can edit content but not delete',
    permissions: ['read', 'write'],
  },
  {
    id: 'role3',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read'],
  },
  {
    id: 'role4',
    name: 'Manager',
    description: 'Department management access',
    permissions: ['read', 'write', 'manage'],
  },
];

const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Engineering Team',
    kind: 'custom',
    type: 'department',
    description: 'All engineering staff',
  },
  {
    id: 'group2',
    name: 'Marketing Team',
    kind: 'custom',
    type: 'department',
    description: 'All marketing staff',
  },
  {
    id: 'group3',
    name: 'Finance Team',
    kind: 'custom',
    type: 'department',
    description: 'All finance staff',
  },
  {
    id: 'group4',
    name: 'Project Alpha',
    kind: 'project',
    type: 'cross-functional',
    description: 'Team working on Project Alpha',
  },
  {
    id: 'group5',
    name: 'Executive Committee',
    kind: 'system',
    type: 'leadership',
    description: 'Company leadership team',
  },
];

const mockUserRoles: UserRole[] = [
  { userId: 'user1', roleId: 'role1' },
  { userId: 'user1', roleId: 'role4' },
  { userId: 'user2', roleId: 'role2' },
  { userId: 'user3', roleId: 'role3' },
  { userId: 'user4', roleId: 'role4' },
  { userId: 'user5', roleId: 'role2' },
  { userId: 'user6', roleId: 'role2' },
];

const mockUserGroups: UserGroup[] = [
  { userId: 'user1', groupId: 'group1' },
  { userId: 'user2', groupId: 'group2' },
  { userId: 'user3', groupId: 'group3' },
  { userId: 'user4', groupId: 'group4' },
  { userId: 'user5', groupId: 'group1' },
  { userId: 'user1', groupId: 'group4' },
  { userId: 'user2', groupId: 'group4' },
  { userId: 'user6', groupId: 'group2' },
  { userId: 'user1', groupId: 'group5' },
];

export function AccessControl() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>('user-roles');

  // State for data
  const [users, setUsers] = useState<User[]>(mockUsers); // For future user management functionality
  const [roles, setRoles] = useState<Role[]>(mockRoles); // For future role management functionality
  const [groups, setGroups] = useState<Group[]>(mockGroups); // For future group management functionality
  const [userRoles, setUserRoles] = useState<UserRole[]>(mockUserRoles);
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);

  // State for filters
  const [userSearch, setUserSearch] = useState('');
  const [groupKindFilter, setGroupKindFilter] = useState<string | null>(null);
  const [groupTypeFilter, setGroupTypeFilter] = useState<string | null>(null);

  // State for selections
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Modals
  const [
    assignRoleModalOpened,
    { open: openAssignRoleModal, close: closeAssignRoleModal },
  ] = useDisclosure(false);

  const [
    assignGroupModalOpened,
    { open: openAssignGroupModal, close: closeAssignGroupModal },
  ] = useDisclosure(false);

  const [
    removeRoleModalOpened,
    { open: openRemoveRoleModal, close: closeRemoveRoleModal },
  ] = useDisclosure(false);

  const [
    removeGroupModalOpened,
    { open: openRemoveGroupModal, close: closeRemoveGroupModal },
  ] = useDisclosure(false);

  // State for modal data
  const [selectedRolesToAssign, setSelectedRolesToAssign] = useState<string[]>(
    []
  );
  const [selectedGroupsToAssign, setSelectedGroupsToAssign] = useState<
    string[]
  >([]);
  const [selectedUserRolesToRemove, setSelectedUserRolesToRemove] = useState<
    string[]
  >([]);
  const [selectedUserGroupsToRemove, setSelectedUserGroupsToRemove] = useState<
    { userId: string; groupId: string }[]
  >([]);

  // Derived data
  const filteredUsers = useMemo(() => {
    if (!userSearch) return users;
    const searchLower = userSearch.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower)
    );
  }, [users, userSearch]);

  const filteredGroups = useMemo(() => {
    let filtered = groups;

    if (groupKindFilter) {
      filtered = filtered.filter((group) => group.kind === groupKindFilter);
    }

    if (groupTypeFilter) {
      filtered = filtered.filter((group) => group.type === groupTypeFilter);
    }

    return filtered;
  }, [groups, groupKindFilter, groupTypeFilter]);

  const groupKinds = useMemo(() => {
    return Array.from(new Set(groups.map((group) => group.kind)));
  }, [groups]);

  const groupTypes = useMemo(() => {
    return Array.from(new Set(groups.map((group) => group.type)));
  }, [groups]);

  // Helper functions
  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const getRoleById = (roleId: string) => {
    return roles.find((role) => role.id === roleId);
  };

  const getGroupById = (groupId: string) => {
    return groups.find((group) => group.id === groupId);
  };

  const getUserRoles = (userId: string) => {
    return userRoles
      .filter((ur) => ur.userId === userId)
      .map((ur) => getRoleById(ur.roleId)!)
      .filter(Boolean);
  };

  const getUserGroups = (userId: string) => {
    return userGroups
      .filter((ug) => ug.userId === userId)
      .map((ug) => getGroupById(ug.groupId)!)
      .filter(Boolean);
  };

  const getGroupMembers = (groupId: string) => {
    return userGroups
      .filter((ug) => ug.groupId === groupId)
      .map((ug) => getUserById(ug.userId)!)
      .filter(Boolean);
  };

  // Action handlers
  const handleAssignRoles = () => {
    const newUserRoles = [...userRoles];

    selectedUsers.forEach((userId) => {
      selectedRolesToAssign.forEach((roleId) => {
        // Check if this assignment already exists
        const exists = newUserRoles.some(
          (ur) => ur.userId === userId && ur.roleId === roleId
        );

        if (!exists) {
          newUserRoles.push({ userId, roleId });
        }
      });
    });

    setUserRoles(newUserRoles);
    setSelectedRolesToAssign([]);
    closeAssignRoleModal();
  };

  const handleAssignGroups = () => {
    const newUserGroups = [...userGroups];

    selectedUsers.forEach((userId) => {
      selectedGroupsToAssign.forEach((groupId) => {
        // Check if this assignment already exists
        const exists = newUserGroups.some(
          (ug) => ug.userId === userId && ug.groupId === groupId
        );

        if (!exists) {
          newUserGroups.push({ userId, groupId });
        }
      });
    });

    setUserGroups(newUserGroups);
    setSelectedGroupsToAssign([]);
    closeAssignGroupModal();
  };

  const handleRemoveRoles = () => {
    const newUserRoles = userRoles.filter(
      (ur) =>
        !selectedUserRolesToRemove.some((item) => item.includes(ur.roleId))
    );

    setUserRoles(newUserRoles);
    setSelectedUserRolesToRemove([]);
    closeRemoveRoleModal();
  };

  const handleRemoveGroups = () => {
    const newUserGroups = userGroups.filter(
      (ug) =>
        !selectedUserGroupsToRemove.some(
          (item) => item.userId === ug.userId && item.groupId === ug.groupId
        )
    );

    setUserGroups(newUserGroups);
    setSelectedUserGroupsToRemove([]);
    closeRemoveGroupModal();
  };

  // Selection handlers
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  const selectAllGroups = () => {
    if (selectedGroups.length === filteredGroups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredGroups.map((group) => group.id));
    }
  };

  const areAllUsersSelected = () => {
    return (
      selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
    );
  };

  const areAllGroupsSelected = () => {
    return (
      selectedGroups.length === filteredGroups.length &&
      filteredGroups.length > 0
    );
  };

  // Render functions
  const renderUserRolesTab = () => {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <TextInput
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ width: '300px' }}
          />

          <Group gap="xs">
            <Button
              leftSection={<IconShield size={16} />}
              onClick={openAssignRoleModal}
              disabled={selectedUsers.length === 0}
            >
              Assign Roles
            </Button>
            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={openRemoveRoleModal}
              disabled={selectedUsers.length === 0}
            >
              Remove Roles
            </Button>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={areAllUsersSelected()}
                  onChange={selectAllUsers}
                  aria-label="Select all users"
                />
              </Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Roles</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.map((user) => {
              const userRolesList = getUserRoles(user.id);

              return (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      aria-label={`Select user ${user.name}`}
                    />
                  </Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.department}</Table.Td>
                  <Table.Td>
                    <Badge color={user.status === 'active' ? 'green' : 'gray'}>
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {userRolesList.map((role) => (
                        <Badge key={role.id} color="blue">
                          {role.name}
                        </Badge>
                      ))}
                      {userRolesList.length === 0 && (
                        <Text size="sm" c="dimmed">
                          No roles assigned
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderUserGroupsTab = () => {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <TextInput
            placeholder="Search users..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ width: '300px' }}
          />

          <Group gap="xs">
            <Button
              leftSection={<IconUsersGroup size={16} />}
              onClick={openAssignGroupModal}
              disabled={selectedUsers.length === 0}
            >
              Assign Groups
            </Button>
            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={openRemoveGroupModal}
              disabled={selectedUserGroupsToRemove.length === 0}
            >
              Remove Groups
            </Button>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={areAllUsersSelected()}
                  onChange={selectAllUsers}
                  aria-label="Select all users"
                />
              </Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Department</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Groups</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers.map((user) => {
              const userGroupsList = getUserGroups(user.id);

              return (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      aria-label={`Select user ${user.name}`}
                    />
                  </Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.department}</Table.Td>
                  <Table.Td>
                    <Badge color={user.status === 'active' ? 'green' : 'gray'}>
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      {userGroupsList.map((group) => {
                        const isPendingRemoval =
                          selectedUserGroupsToRemove.some(
                            (item) =>
                              item.userId === user.id &&
                              item.groupId === group.id
                          );

                        return (
                          <Badge
                            key={group.id}
                            color={isPendingRemoval ? 'red' : 'teal'}
                            variant={isPendingRemoval ? 'light' : 'filled'}
                            style={
                              isPendingRemoval
                                ? {
                                    textDecoration: 'line-through',
                                    opacity: 0.7,
                                  }
                                : {}
                            }
                          >
                            {group.name}
                            {isPendingRemoval && ' (removing)'}
                          </Badge>
                        );
                      })}
                      {userGroupsList.length === 0 && (
                        <Text size="sm" c="dimmed">
                          No groups assigned
                        </Text>
                      )}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconChevronDown size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Group Actions</Menu.Label>
                        {userGroupsList.map((group) => (
                          <Menu.Item
                            key={group.id}
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => {
                              setSelectedUserGroupsToRemove([
                                ...selectedUserGroupsToRemove,
                                { userId: user.id, groupId: group.id },
                              ]);
                            }}
                          >
                            Remove from {group.name}
                          </Menu.Item>
                        ))}
                        {userGroupsList.length === 0 && (
                          <Menu.Item disabled>No groups to remove</Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

  const renderGroupMembersTab = () => {
    return (
      <Stack gap="md">
        <Group justify="space-between">
          <Group gap="xs">
            <Select
              placeholder="Filter by kind"
              value={groupKindFilter}
              onChange={setGroupKindFilter}
              data={groupKinds.map((kind) => ({ value: kind, label: kind }))}
              clearable
              leftSection={<IconFilter size={16} />}
              style={{ width: '200px' }}
            />
            <Select
              placeholder="Filter by type"
              value={groupTypeFilter}
              onChange={setGroupTypeFilter}
              data={groupTypes.map((type) => ({ value: type, label: type }))}
              clearable
              leftSection={<IconFilter size={16} />}
              style={{ width: '200px' }}
            />
          </Group>

          <Button
            variant="outline"
            leftSection={<IconUserPlus size={16} />}
            onClick={openAssignGroupModal}
            disabled={selectedGroups.length === 0}
          >
            Add Members
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 40 }}>
                <Checkbox
                  checked={areAllGroupsSelected()}
                  onChange={selectAllGroups}
                  aria-label="Select all groups"
                />
              </Table.Th>
              <Table.Th>Group Name</Table.Th>
              <Table.Th>Kind</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Members</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredGroups.map((group) => {
              const groupMembers = getGroupMembers(group.id);

              return (
                <Table.Tr key={group.id}>
                  <Table.Td>
                    <Checkbox
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroupSelection(group.id)}
                      aria-label={`Select group ${group.name}`}
                    />
                  </Table.Td>
                  <Table.Td>{group.name}</Table.Td>
                  <Table.Td>
                    <Badge color="blue">{group.kind}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color="violet">{group.type}</Badge>
                  </Table.Td>
                  <Table.Td>{group.description}</Table.Td>
                  <Table.Td>
                    <Tooltip.Group openDelay={300} closeDelay={100}>
                      <Group gap="xs">
                        {groupMembers.slice(0, 3).map((member) => (
                          <Tooltip key={member.id} label={member.name}>
                            <Badge color="gray">
                              {member.name.split(' ')[0]}
                            </Badge>
                          </Tooltip>
                        ))}
                        {groupMembers.length > 3 && (
                          <Tooltip
                            label={groupMembers
                              .slice(3)
                              .map((m) => m.name)
                              .join(', ')}
                          >
                            <Badge color="gray">
                              +{groupMembers.length - 3}
                            </Badge>
                          </Tooltip>
                        )}
                        {groupMembers.length === 0 && (
                          <Text size="sm" c="dimmed">
                            No members
                          </Text>
                        )}
                      </Group>
                    </Tooltip.Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  };

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
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab
                value="user-roles"
                leftSection={<IconShield size={16} />}
              >
                User Roles
              </Tabs.Tab>
              <Tabs.Tab
                value="user-groups"
                leftSection={<IconUsersGroup size={16} />}
              >
                User Groups
              </Tabs.Tab>
              <Tabs.Tab
                value="group-members"
                leftSection={<IconUsers size={16} />}
              >
                Group Members
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="user-roles" pt="md">
              {renderUserRolesTab()}
            </Tabs.Panel>

            <Tabs.Panel value="user-groups" pt="md">
              {renderUserGroupsTab()}
            </Tabs.Panel>

            <Tabs.Panel value="group-members" pt="md">
              {renderGroupMembersTab()}
            </Tabs.Panel>
          </Tabs>
        </Card>
      </Stack>

      {/* Assign Role Modal */}
      <Modal
        opened={assignRoleModalOpened}
        onClose={closeAssignRoleModal}
        title="Assign Roles"
        centered
      >
        <Stack gap="md">
          <Text>Assign roles to {selectedUsers.length} selected user(s):</Text>

          <Box>
            <Text fw={500} mb="xs">
              Selected users:
            </Text>
            {selectedUsers.map((userId) => {
              const user = getUserById(userId);
              return (
                <Text key={userId} size="sm">
                  • {user?.name}
                </Text>
              );
            })}
          </Box>

          <Divider />

          <MultiSelect
            label="Select roles to assign"
            placeholder="Choose roles"
            data={roles.map((role) => ({
              value: role.id,
              label: role.name,
              description: role.description,
            }))}
            value={selectedRolesToAssign}
            onChange={setSelectedRolesToAssign}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeAssignRoleModal}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignRoles}
              disabled={selectedRolesToAssign.length === 0}
            >
              Assign
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Assign Group Modal */}
      <Modal
        opened={assignGroupModalOpened}
        onClose={closeAssignGroupModal}
        title="Assign Groups"
        centered
      >
        <Stack gap="md">
          <Text>
            {selectedUsers.length > 0
              ? `Assign groups to ${selectedUsers.length} selected user(s):`
              : `Add members to ${selectedGroups.length} selected group(s):`}
          </Text>

          {selectedUsers.length > 0 && (
            <Box>
              <Text fw={500} mb="xs">
                Selected users:
              </Text>
              {selectedUsers.map((userId) => {
                const user = getUserById(userId);
                return (
                  <Text key={userId} size="sm">
                    • {user?.name}
                  </Text>
                );
              })}
            </Box>
          )}

          {selectedGroups.length > 0 && (
            <Box>
              <Text fw={500} mb="xs">
                Selected groups:
              </Text>
              {selectedGroups.map((groupId) => {
                const group = getGroupById(groupId);
                return (
                  <Text key={groupId} size="sm">
                    • {group?.name}
                  </Text>
                );
              })}
            </Box>
          )}

          <Divider />

          {selectedUsers.length > 0 && (
            <MultiSelect
              label="Select groups to assign"
              placeholder="Choose groups"
              data={groups.map((group) => ({
                value: group.id,
                label: group.name,
                description: `${group.kind} - ${group.type}`,
              }))}
              value={selectedGroupsToAssign}
              onChange={setSelectedGroupsToAssign}
            />
          )}

          {selectedGroups.length > 0 && (
            <MultiSelect
              label="Select users to add as members"
              placeholder="Choose users"
              data={users.map((user) => ({
                value: user.id,
                label: user.name,
                description: user.email,
              }))}
              value={selectedUsers}
              onChange={setSelectedUsers}
            />
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeAssignGroupModal}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignGroups}
              disabled={
                (selectedUsers.length === 0 && selectedGroups.length === 0) ||
                (selectedUsers.length > 0 &&
                  selectedGroupsToAssign.length === 0)
              }
            >
              {selectedUsers.length > 0 ? 'Assign' : 'Add Members'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Remove Role Modal */}
      <Modal
        opened={removeRoleModalOpened}
        onClose={closeRemoveRoleModal}
        title="Remove Roles"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to remove the following role assignments?
          </Text>

          <Box>
            {selectedUsers.map((usr) => {
              const user = getUserById(usr);
              const roles = selectedUserRolesToRemove.map((roleId) =>
                getRoleById(roleId)
              );
              return (
                <Text key={`${user?.id}`} size="sm">
                  • Remove {roles.join(',')} from {user?.name}
                </Text>
              );
            })}
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeRemoveRoleModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleRemoveRoles}>
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Remove Group Modal */}
      <Modal
        opened={removeGroupModalOpened}
        onClose={closeRemoveGroupModal}
        title="Remove Group Assignments"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to remove the following group assignments?
          </Text>

          <Box>
            {selectedUserGroupsToRemove.map((item) => {
              const user = getUserById(item.userId);
              const group = getGroupById(item.groupId);
              return (
                <Text key={`${item.userId}-${item.groupId}`} size="sm">
                  • Remove {user?.name} from {group?.name}
                </Text>
              );
            })}
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeRemoveGroupModal}>
              Cancel
            </Button>
            <Button color="red" onClick={handleRemoveGroups}>
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>
      {/* Remove Role Modal */}
      <Modal
        opened={removeRoleModalOpened}
        onClose={closeRemoveRoleModal}
        title="Remove Roles"
        centered
        size="md"
      >
        <Stack gap="md">
          <Text>
            Remove roles from {selectedUsers.length} selected user(s):
          </Text>

          <Box>
            <Text fw={500} mb="xs">
              Selected users:
            </Text>
            {selectedUsers.map((userId) => {
              const user = getUserById(userId);
              return (
                <Text key={userId} size="sm">
                  • {user?.name}
                </Text>
              );
            })}
          </Box>

          <Divider />

          <MultiSelect
            label="Select roles to remove"
            placeholder="Choose roles to remove"
            data={(() => {
              // Get all roles assigned to selected users
              const availableRoles = new Set<string>();
              selectedUsers.forEach((userId) => {
                const userRolesList = getUserRoles(userId);
                userRolesList.forEach((role) => availableRoles.add(role.id));
              });

              return Array.from(availableRoles).map((roleId) => {
                const role = getRoleById(roleId);
                return {
                  value: roleId,
                  label: role?.name || '',
                  description: role?.description || '',
                };
              });
            })()}
            value={selectedUserRolesToRemove}
            onChange={(value) => setSelectedUserRolesToRemove([...value])}
            searchable
            clearable
          />

          {selectedUserRolesToRemove.length > 0 && (
            <Box>
              <Text fw={500} mb="xs" c="red">
                Preview of changes:
              </Text>
              <Stack gap="xs">
                {selectedUsers.map((userId) => {
                  const user = getUserById(userId);
                  const userCurrentRoles = getUserRoles(userId);
                  const rolesToRemove = userCurrentRoles.filter((role) =>
                    selectedUserRolesToRemove.includes(role.id)
                  );

                  if (rolesToRemove.length === 0) return null;

                  return (
                    <Text key={userId} size="sm">
                      <strong>{user?.name}:</strong> Remove{' '}
                      {rolesToRemove.map((role) => role.name).join(', ')}
                    </Text>
                  );
                })}
              </Stack>
            </Box>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeRemoveRoleModal}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleRemoveRoles}
              disabled={selectedUserRolesToRemove.length === 0}
            >
              Remove Roles
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
