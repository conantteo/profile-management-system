import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  MultiSelect,
  SegmentedControl,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agGridTheme } from '../../App';

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

  // State for selected user and changes
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [pendingRoleChanges, setPendingRoleChanges] = useState<{
    add: string[];
    remove: string[];
  }>({ add: [], remove: [] });

  const [pendingGroupChanges, setPendingGroupChanges] = useState<{
    add: string[];
    remove: string[];
  }>({ add: [], remove: [] });

  // Existing state
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [userRoles, setUserRoles] = useState<UserRole[]>(mockUserRoles);
  const [userGroups, setUserGroups] = useState<UserGroup[]>(mockUserGroups);

  // Add new state
  const [lookupType, setLookupType] = useState<string>('role');
  const [selectedLookupId, setSelectedLookupId] = useState<string | null>(null);
  const [pendingLookupChanges, setPendingLookupChanges] = useState<{
    details: { name?: string; description?: string; permissions?: string[] };
    members: { add: string[]; remove: string[] };
  }>({
    details: {},
    members: { add: [], remove: [] },
  });

  const [activeTab, setActiveTab] = useState<'access' | 'lookup' | 'users'>(
    'access'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [membersPage, setMembersPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Helper functions
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

  const handleSaveChanges = () => {
    if (!selectedUser) return;

    // Apply role changes
    const newUserRoles = [...userRoles];

    // Remove roles
    pendingRoleChanges.remove.forEach((roleId) => {
      const index = newUserRoles.findIndex(
        (ur) => ur.userId === selectedUser.id && ur.roleId === roleId
      );
      if (index !== -1) {
        newUserRoles.splice(index, 1);
      }
    });

    // Add roles
    pendingRoleChanges.add.forEach((roleId) => {
      if (
        !newUserRoles.some(
          (ur) => ur.userId === selectedUser.id && ur.roleId === roleId
        )
      ) {
        newUserRoles.push({ userId: selectedUser.id, roleId });
      }
    });

    setUserRoles(newUserRoles);

    // Apply group changes
    const newUserGroups = [...userGroups];

    // Remove groups
    pendingGroupChanges.remove.forEach((groupId) => {
      const index = newUserGroups.findIndex(
        (ug) => ug.userId === selectedUser.id && ug.groupId === groupId
      );
      if (index !== -1) {
        newUserGroups.splice(index, 1);
      }
    });

    // Add groups
    pendingGroupChanges.add.forEach((groupId) => {
      if (
        !newUserGroups.some(
          (ug) => ug.userId === selectedUser.id && ug.groupId === groupId
        )
      ) {
        newUserGroups.push({ userId: selectedUser.id, groupId });
      }
    });

    setUserGroups(newUserGroups);

    // Reset changes
    setPendingRoleChanges({ add: [], remove: [] });
    setPendingGroupChanges({ add: [], remove: [] });
  };

  const handleLookupSave = () => {
    if (!selectedLookupId) return;

    if (lookupType === 'role') {
      // Update role details
      setRoles(
        roles.map((role) =>
          role.id === selectedLookupId
            ? { ...role, ...pendingLookupChanges.details }
            : role
        )
      );

      // Update role members
      const newUserRoles = [...userRoles];
      pendingLookupChanges.members.remove.forEach((userId) => {
        const index = newUserRoles.findIndex(
          (ur) => ur.userId === userId && ur.roleId === selectedLookupId
        );
        if (index !== -1) newUserRoles.splice(index, 1);
      });

      pendingLookupChanges.members.add.forEach((userId) => {
        newUserRoles.push({ userId, roleId: selectedLookupId });
      });

      setUserRoles(newUserRoles);
    } else {
      // Update group details
      setGroups(
        groups.map((group) =>
          group.id === selectedLookupId
            ? { ...group, ...pendingLookupChanges.details }
            : group
        )
      );

      // Update group members
      const newUserGroups = [...userGroups];
      pendingLookupChanges.members.remove.forEach((userId) => {
        const index = newUserGroups.findIndex(
          (ug) => ug.userId === userId && ug.groupId === selectedLookupId
        );
        if (index !== -1) newUserGroups.splice(index, 1);
      });

      pendingLookupChanges.members.add.forEach((userId) => {
        newUserGroups.push({ userId, groupId: selectedLookupId });
      });

      setUserGroups(newUserGroups);
    }

    // Reset pending changes
    setPendingLookupChanges({
      details: {},
      members: { add: [], remove: [] },
    });
  };

  const UsersTable = () => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    };

    const columnDefs = [
      {
        field: 'name',
        headerName: 'Name',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'email',
        headerName: 'Email',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'department',
        headerName: 'Department',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'status',
        headerName: 'Status',
        filter: 'agSetColumnFilter',
        sortable: true,
        cellRenderer: (params) => (
          <Badge color={params.value === 'active' ? 'green' : 'red'}>
            {params.value}
          </Badge>
        ),
      },
      {
        field: 'roles',
        headerName: 'Roles',
        filter: false,
        sortable: false,
        cellRenderer: (params) => (
          <Group gap={4}>
            {getUserRoles(params.data.id).map((role) => (
              <Badge size="sm" key={role.id}>
                {role.name}
              </Badge>
            ))}
          </Group>
        ),
      },
      {
        field: 'groups',
        headerName: 'Groups',
        filter: false,
        sortable: false,
        cellRenderer: (params) => (
          <Group gap={4}>
            {getUserGroups(params.data.id).map((group) => (
              <Badge size="sm" key={group.id}>
                {group.name}
              </Badge>
            ))}
          </Group>
        ),
      },
    ];

    const defaultColDef = {
      flex: 1,
      minWidth: 100,
      resizable: true,
    };

    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <div style={{ height: 600, width: '100%' }}>
          <AgGridReact
            theme={agGridTheme}
            columnDefs={columnDefs}
            rowData={users}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={20}
            onGridReady={onGridReady}
            animateRows={true}
          />
        </div>
      </Card>
    );
  };

  const MemberManagement = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleDeleteMember = (userId: string) => {
      if (lookupType === 'role') {
        setUserRoles((prev) =>
          prev.filter(
            (ur) => !(ur.userId === userId && ur.roleId === selectedLookupId)
          )
        );
      } else {
        setUserGroups((prev) =>
          prev.filter(
            (ug) => !(ug.userId === userId && ug.groupId === selectedLookupId)
          )
        );
      }
    };

    const columnDefs = [
      {
        field: 'name',
        headerName: 'Name',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'email',
        headerName: 'Email',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'department',
        headerName: 'Department',
        filter: 'agTextColumnFilter',
        sortable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        sortable: false,
        filter: false,
        cellRenderer: (params) => (
          <Group gap="xs">
            <ActionIcon
              color="blue"
              onClick={() => {
                /* Handle edit */
              }}
            >
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon
              color="red"
              onClick={() => handleDeleteMember(params.data.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ),
      },
    ];

    return (
      <Card withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Manage Members</Title>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Member</Button>
          </Group>

          <div style={{ height: 400, width: '100%' }}>
            <AgGridReact
              theme={agGridTheme}
              columnDefs={columnDefs}
              rowData={users.filter((user) =>
                lookupType === 'role'
                  ? userRoles.some(
                      (ur) =>
                        ur.userId === user.id && ur.roleId === selectedLookupId
                    )
                  : userGroups.some(
                      (ug) =>
                        ug.userId === user.id && ug.groupId === selectedLookupId
                    )
              )}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={20}
            />
          </div>

          {/* Add Member Modal */}
          <Modal
            opened={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            title="Add Member"
          >
            <Stack>
              <Select
                label="Select User"
                data={users
                  .filter((user) =>
                    lookupType === 'role'
                      ? !userRoles.some(
                          (ur) =>
                            ur.userId === user.id &&
                            ur.roleId === selectedLookupId
                        )
                      : !userGroups.some(
                          (ug) =>
                            ug.userId === user.id &&
                            ug.groupId === selectedLookupId
                        )
                  )
                  .map((user) => ({
                    value: user.id,
                    label: user.name,
                    description: user.email,
                  }))}
                onChange={(userId) => {
                  if (!userId) return;
                  if (lookupType === 'role') {
                    setUserRoles((prev) => [
                      ...prev,
                      { userId, roleId: selectedLookupId! },
                    ]);
                  } else {
                    setUserGroups((prev) => [
                      ...prev,
                      { userId, groupId: selectedLookupId! },
                    ]);
                  }
                  setIsAddModalOpen(false);
                }}
              />
            </Stack>
          </Modal>
        </Stack>
      </Card>
    );
  };

  return (
    <Container size="lg" py="xl">
      <SegmentedControl
        value={activeTab}
        onChange={(value: 'access' | 'lookup' | 'users') => setActiveTab(value)}
        data={[
          { label: 'Access Control', value: 'access' },
          { label: 'Access Lookup', value: 'lookup' },
          { label: 'Users List', value: 'users' },
        ]}
        mb="xl"
      />

      {activeTab === 'access' && (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            {/* User Search */}
            <Select
              label="Select User"
              placeholder="Search for a user..."
              searchable
              clearable
              data={users.map((user) => ({
                value: user.id,
                label: user.name,
                description: user.email,
              }))}
              value={selectedUser?.id}
              onChange={(value) => {
                setSelectedUser(users.find((u) => u.id === value) || null);
                setPendingRoleChanges({ add: [], remove: [] });
                setPendingGroupChanges({ add: [], remove: [] });
              }}
            />

            {selectedUser && (
              <>
                {/* Current Access Display */}
                <Box>
                  <Text fw={500} mb="xs">
                    Current Roles:
                  </Text>
                  <MultiSelect
                    label="User Roles"
                    placeholder="Select roles"
                    data={roles.map((role) => ({
                      value: role.id,
                      label: role.name,
                      description: role.description,
                    }))}
                    value={getUserRoles(selectedUser.id)
                      .map((role) => role.id)
                      .filter((id) => !pendingRoleChanges.remove.includes(id))
                      .concat(pendingRoleChanges.add)}
                    onChange={(selectedRoles) => {
                      const currentRoles = getUserRoles(selectedUser.id).map(
                        (role) => role.id
                      );

                      // Calculate additions and removals
                      const toAdd = selectedRoles.filter(
                        (roleId) => !currentRoles.includes(roleId)
                      );
                      const toRemove = currentRoles.filter(
                        (roleId) => !selectedRoles.includes(roleId)
                      );

                      setPendingRoleChanges({
                        add: toAdd,
                        remove: toRemove,
                      });
                    }}
                  />
                </Box>

                <Box>
                  <Text fw={500} mb="xs">
                    Current Groups:
                  </Text>
                  <MultiSelect
                    label="User Groups"
                    placeholder="Select groups"
                    data={groups.map((group) => ({
                      value: group.id,
                      label: group.name,
                      description: group.description,
                    }))}
                    value={getUserGroups(selectedUser.id)
                      .map((group) => group.id)
                      .filter((id) => !pendingGroupChanges.remove.includes(id))
                      .concat(pendingGroupChanges.add)}
                    onChange={(selectedGroups) => {
                      const currentGroups = getUserGroups(selectedUser.id).map(
                        (group) => group.id
                      );

                      // Calculate additions and removals
                      const toAdd = selectedGroups.filter(
                        (groupId) => !currentGroups.includes(groupId)
                      );
                      const toRemove = currentGroups.filter(
                        (groupId) => !selectedGroups.includes(groupId)
                      );

                      setPendingGroupChanges({
                        add: toAdd,
                        remove: toRemove,
                      });
                    }}
                  />
                </Box>

                {/* Save Changes */}
                <Group justify="flex-end">
                  <Button
                    onClick={handleSaveChanges}
                    disabled={
                      pendingRoleChanges.add.length === 0 &&
                      pendingRoleChanges.remove.length === 0 &&
                      pendingGroupChanges.add.length === 0 &&
                      pendingGroupChanges.remove.length === 0
                    }
                  >
                    Save
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Card>
      )}

      {activeTab === 'lookup' && (
        <Card shadow="sm" padding="lg" radius="md" withBorder mt="xl">
          <Stack gap="md">
            <Title order={2}>Access Lookup</Title>

            <SegmentedControl
              value={lookupType}
              onChange={(value: string) => {
                setLookupType(value);
                setSelectedLookupId(null);
              }}
              data={[
                { label: 'Role Lookup', value: 'role' },
                { label: 'Group Lookup', value: 'group' },
              ]}
            />

            <Select
              label={`Select ${lookupType === 'role' ? 'Role' : 'Group'}`}
              placeholder={`Choose a ${lookupType}...`}
              value={selectedLookupId}
              onChange={setSelectedLookupId}
              data={
                lookupType === 'role'
                  ? roles.map((role) => ({ value: role.id, label: role.name }))
                  : groups.map((group) => ({
                      value: group.id,
                      label: group.name,
                    }))
              }
            />

            {selectedLookupId && (
              <Stack gap="md">
                <Card withBorder>
                  <Stack gap="md">
                    <Title order={3}>
                      Edit {lookupType === 'role' ? 'Role' : 'Group'} Details
                    </Title>

                    <TextInput
                      label="Name"
                      defaultValue={
                        lookupType === 'role'
                          ? roles.find((r) => r.id === selectedLookupId)?.name
                          : groups.find((g) => g.id === selectedLookupId)?.name
                      }
                      onChange={(e) =>
                        setPendingLookupChanges((prev) => ({
                          ...prev,
                          details: { ...prev.details, name: e.target.value },
                        }))
                      }
                    />

                    <Textarea
                      label="Description"
                      defaultValue={
                        lookupType === 'role'
                          ? roles.find((r) => r.id === selectedLookupId)
                              ?.description
                          : groups.find((g) => g.id === selectedLookupId)
                              ?.description
                      }
                      onChange={(e) =>
                        setPendingLookupChanges((prev) => ({
                          ...prev,
                          details: {
                            ...prev.details,
                            description: e.target.value,
                          },
                        }))
                      }
                    />

                    {lookupType === 'role' && (
                      <MultiSelect
                        label="Permissions"
                        data={['read', 'write', 'delete', 'admin']}
                        defaultValue={
                          roles.find((r) => r.id === selectedLookupId)
                            ?.permissions
                        }
                        onChange={(value) =>
                          setPendingLookupChanges((prev) => ({
                            ...prev,
                            details: { ...prev.details, permissions: value },
                          }))
                        }
                      />
                    )}
                  </Stack>
                </Card>

                <MemberManagement />

                <Group justify="flex-end">
                  <Button
                    onClick={handleLookupSave}
                    disabled={
                      Object.keys(pendingLookupChanges.details).length === 0 &&
                      pendingLookupChanges.members.add.length === 0 &&
                      pendingLookupChanges.members.remove.length === 0
                    }
                  >
                    Save Changes
                  </Button>
                </Group>
              </Stack>
            )}
          </Stack>
        </Card>
      )}

      {activeTab === 'users' && <UsersTable />}
    </Container>
  );
}
