import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertCircle,
  IconDatabase,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconTrash,
} from '@tabler/icons-react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { agGridTheme } from '../../App';

// Mock interface for entity data
interface EntitySection {
  id: string;
  name: string;
  type: string;
  indexed: boolean;
  lastModified: string;
  modifiedBy: string;
}

interface Entity {
  id: string;
  name: string;
  type: string;
  indexed: boolean;
  createdAt: string;
  createdBy: string;
  lastModified: string;
  modifiedBy: string;
  sections: EntitySection[];
}

export function EntityConsole() {
  const navigate = useNavigate();
  const [entityId, setEntityId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [entity, setEntity] = useState<Entity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('entity');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Modals
  const [
    deleteEntityModalOpened,
    { open: openDeleteEntityModal, close: closeDeleteEntityModal },
  ] = useDisclosure(false);
  const [
    deleteSectionsModalOpened,
    { open: openDeleteSectionsModal, close: closeDeleteSectionsModal },
  ] = useDisclosure(false);
  const [
    indexEntityModalOpened,
    { open: openIndexEntityModal, close: closeIndexEntityModal },
  ] = useDisclosure(false);
  const [
    indexSectionsModalOpened,
    { open: openIndexSectionsModal, close: closeIndexSectionsModal },
  ] = useDisclosure(false);

  // Mock function to search for an entity
  const handleSearch = () => {
    if (!entityId.trim()) {
      setError('Please enter an entity ID');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEntity(null);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, always return a mock entity
      if (entityId === 'not-found') {
        setError('Entity not found');
        setIsLoading(false);
        return;
      }

      const mockEntity: Entity = {
        id: entityId,
        name: `Entity ${entityId}`,
        type: 'Person',
        indexed: Math.random() > 0.5,
        createdAt: new Date().toISOString(),
        createdBy: 'Admin User',
        lastModified: new Date().toISOString(),
        modifiedBy: 'Admin User',
        sections: [
          {
            id: '1',
            name: 'Personal Details',
            type: 'Basic Information',
            indexed: true,
            lastModified: new Date().toISOString(),
            modifiedBy: 'Admin User',
          },
          {
            id: '2',
            name: 'Professional Experience',
            type: 'Career History',
            indexed: false,
            lastModified: new Date().toISOString(),
            modifiedBy: 'System',
          },
          {
            id: '3',
            name: 'Education',
            type: 'Academic History',
            indexed: true,
            lastModified: new Date().toISOString(),
            modifiedBy: 'Admin User',
          },
          {
            id: '4',
            name: 'Skills',
            type: 'Capabilities',
            indexed: false,
            lastModified: new Date().toISOString(),
            modifiedBy: 'System',
          },
          {
            id: '5',
            name: 'Contact Information',
            type: 'Communication Details',
            indexed: true,
            lastModified: new Date().toISOString(),
            modifiedBy: 'Admin User',
          },
        ],
      };

      setEntity(mockEntity);
      setIsLoading(false);
    }, 1000);
  };

  // Handle entity indexing
  const handleIndexEntity = () => {
    if (!entity) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEntity({
        ...entity,
        indexed: true,
        lastModified: new Date().toISOString(),
      });
      setIsLoading(false);
      closeIndexEntityModal();
    }, 1000);
  };

  // Handle entity deletion
  const handleDeleteEntity = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEntity(null);
      setEntityId('');
      setIsLoading(false);
      closeDeleteEntityModal();
    }, 1000);
  };

  // Handle section indexing
  const handleIndexSections = () => {
    if (!entity) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedSections = entity.sections.map((section) => {
        if (selectedSections.includes(section.id)) {
          return {
            ...section,
            indexed: true,
            lastModified: new Date().toISOString(),
          };
        }
        return section;
      });

      setEntity({
        ...entity,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      });

      setIsLoading(false);
      setSelectedSections([]);
      closeIndexSectionsModal();
    }, 1000);
  };

  // Handle section deletion
  const handleDeleteSections = () => {
    if (!entity) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const updatedSections = entity.sections.filter(
        (section) => !selectedSections.includes(section.id)
      );

      setEntity({
        ...entity,
        sections: updatedSections,
        lastModified: new Date().toISOString(),
      });

      setIsLoading(false);
      setSelectedSections([]);
      closeDeleteSectionsModal();
    }, 1000);
  };

  // Toggle section selection
  const toggleSectionSelection = (sectionId: string) => {
    setSelectedSections((prev) => {
      if (prev.includes(sectionId)) {
        return prev.filter((id) => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  // Select all sections
  const selectAllSections = () => {
    if (!entity) return;

    if (selectedSections.length === entity.sections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(entity.sections.map((section) => section.id));
    }
  };

  // Check if all sections are selected
  const areAllSectionsSelected = () => {
    if (!entity) return false;
    return selectedSections.length === entity.sections.length;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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

        {/* Entity Search */}
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group gap="md">
              <IconDatabase size={40} color="blue" />
              <div>
                <Text fw={500}>Entity Lookup</Text>
                <Text size="sm" c="dimmed">
                  Search for entities by ID
                </Text>
              </div>
            </Group>

            <Group grow>
              <TextInput
                placeholder="Enter entity ID"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                disabled={isLoading}
              />
              <Button
                leftSection={<IconSearch size={16} />}
                onClick={handleSearch}
                loading={isLoading}
                disabled={!entityId.trim()}
              >
                Search
              </Button>
            </Group>
          </Stack>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
            {error}
          </Alert>
        )}

        {/* Entity Results */}
        {entity && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Group justify="space-between">
                <Group gap="md">
                  <IconSettings size={40} color="orange" />
                  <div>
                    <Group gap="xs">
                      <Text fw={500}>{entity.name}</Text>
                      <Badge color={entity.indexed ? 'green' : 'gray'}>
                        {entity.indexed ? 'Indexed' : 'Not Indexed'}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      ID: {entity.id} | Type: {entity.type}
                    </Text>
                  </div>
                </Group>

                <Group gap="xs">
                  <Button
                    variant="outline"
                    color="blue"
                    leftSection={<IconRefresh size={16} />}
                    onClick={openIndexEntityModal}
                    disabled={entity.indexed}
                  >
                    Index Entity
                  </Button>
                  <Button
                    variant="outline"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={openDeleteEntityModal}
                  >
                    Delete Entity
                  </Button>
                </Group>
              </Group>

              <Divider />

              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Created:
                </Text>
                <Text size="sm">
                  {formatDate(entity.createdAt)} by {entity.createdBy}
                </Text>
              </Group>

              <Group gap="xs">
                <Text size="sm" fw={500}>
                  Last Modified:
                </Text>
                <Text size="sm">
                  {formatDate(entity.lastModified)} by {entity.modifiedBy}
                </Text>
              </Group>

              <Divider />

              <Tabs value={activeTab} onChange={setActiveTab}>
                <Tabs.List>
                  <Tabs.Tab value="entity">Entity Details</Tabs.Tab>
                  <Tabs.Tab value="sections">
                    Sections ({entity.sections.length})
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="entity" pt="md">
                  <Text>
                    This panel would contain detailed entity information and
                    properties. For this demo, we're focusing on the sections
                    management functionality.
                  </Text>
                </Tabs.Panel>

                <Tabs.Panel value="sections" pt="md">
                  <Stack gap="md">
                    <Group justify="space-between">
                      <Text fw={500}>Entity Sections</Text>
                      <Group gap="xs">
                        <Button
                          size="xs"
                          variant="outline"
                          color="blue"
                          leftSection={<IconRefresh size={16} />}
                          onClick={openIndexSectionsModal}
                          disabled={
                            selectedSections.length === 0 ||
                            selectedSections.every(
                              (id) =>
                                entity.sections.find(
                                  (section) => section.id === id
                                )?.indexed
                            )
                          }
                        >
                          Index Selected
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={openDeleteSectionsModal}
                          disabled={selectedSections.length === 0}
                        >
                          Delete Selected
                        </Button>
                      </Group>
                    </Group>

                    <div style={{ height: 400, width: '100%' }}>
                      <AgGridReact
                        theme={agGridTheme}
                        columnDefs={[
                          {
                            field: 'name',
                            headerName: 'Name',
                            filter: 'agTextColumnFilter',
                            sortable: true,
                          },
                          {
                            field: 'type',
                            headerName: 'Type',
                            filter: 'agTextColumnFilter',
                            sortable: true,
                          },
                          {
                            field: 'status',
                            headerName: 'Status',
                            filter: 'agSetColumnFilter',
                            sortable: true,
                            cellRenderer: (params) => (
                              <Badge
                                color={params.data.indexed ? 'green' : 'gray'}
                              >
                                {params.data.indexed
                                  ? 'Indexed'
                                  : 'Not Indexed'}
                              </Badge>
                            ),
                          },
                          {
                            field: 'lastModified',
                            headerName: 'Last Modified',
                            filter: 'agDateColumnFilter',
                            sortable: true,
                            cellRenderer: (params) => formatDate(params.value),
                          },
                          {
                            field: 'modifiedBy',
                            headerName: 'Modified By',
                            filter: 'agTextColumnFilter',
                            sortable: true,
                          },
                        ]}
                        rowData={entity.sections}
                        defaultColDef={{
                          flex: 1,
                          minWidth: 100,
                          resizable: true,
                        }}
                        rowSelection={{
                          enableClickSelection: true,
                          checkboxes: true,
                          mode: 'multiRow',
                        }}
                        onSelectionChanged={(event) => {
                          const selectedNodes = event.api.getSelectedNodes();
                          const selectedIds = selectedNodes.map(
                            (node) => node.data.id
                          );
                          setSelectedSections(selectedIds);
                        }}
                        pagination={true}
                        paginationPageSize={20}
                      />
                    </div>
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Stack>
          </Card>
        )}

        {/* Entity Configuration Info (shown when no entity is selected) */}
        {!entity && !isLoading && !error && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group gap="md">
              <IconSettings size={40} color="orange" />
              <div>
                <Text fw={500}>Entity Configuration</Text>
                <Text size="sm" c="dimmed">
                  Search for an entity above to configure its properties and
                  relationships
                </Text>
              </div>
            </Group>
          </Card>
        )}
      </Stack>

      {/* Delete Entity Modal */}
      <Modal
        opened={deleteEntityModalOpened}
        onClose={closeDeleteEntityModal}
        title="Delete Entity"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete the entity "{entity?.name}" (ID:{' '}
            {entity?.id})? This action cannot be undone.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeDeleteEntityModal}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteEntity}
              loading={isLoading}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Sections Modal */}
      <Modal
        opened={deleteSectionsModalOpened}
        onClose={closeDeleteSectionsModal}
        title="Delete Sections"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete {selectedSections.length} selected
            section(s)? This action cannot be undone.
          </Text>

          <Box>
            <Text fw={500} mb="xs">
              Selected sections:
            </Text>
            {entity?.sections
              .filter((section) => selectedSections.includes(section.id))
              .map((section) => (
                <Text key={section.id} size="sm">
                  • {section.name}
                </Text>
              ))}
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeDeleteSectionsModal}>
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDeleteSections}
              loading={isLoading}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Index Entity Modal */}
      <Modal
        opened={indexEntityModalOpened}
        onClose={closeIndexEntityModal}
        title="Index Entity"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to index the entity "{entity?.name}" (ID:{' '}
            {entity?.id})? This will make the entity searchable in the system.
          </Text>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeIndexEntityModal}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleIndexEntity}
              loading={isLoading}
            >
              Index
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Index Sections Modal */}
      <Modal
        opened={indexSectionsModalOpened}
        onClose={closeIndexSectionsModal}
        title="Index Sections"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to index {selectedSections.length} selected
            section(s)? This will make these sections searchable in the system.
          </Text>

          <Box>
            <Text fw={500} mb="xs">
              Selected sections:
            </Text>
            {entity?.sections
              .filter((section) => selectedSections.includes(section.id))
              .map((section) => (
                <Text key={section.id} size="sm">
                  • {section.name} -{' '}
                  {section.indexed ? (
                    <Badge size="xs" color="green">
                      Already Indexed
                    </Badge>
                  ) : (
                    <Badge size="xs" color="gray">
                      Not Indexed
                    </Badge>
                  )}
                </Text>
              ))}
          </Box>

          <Group justify="flex-end" mt="md">
            <Button variant="outline" onClick={closeIndexSectionsModal}>
              Cancel
            </Button>
            <Button
              color="blue"
              onClick={handleIndexSections}
              loading={isLoading}
            >
              Index
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
