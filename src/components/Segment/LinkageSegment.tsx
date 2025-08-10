import {
  Button,
  Card,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { IconPlus } from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import type React from 'react';
import { useState } from 'react';
import { agGridTheme } from '../../App';
import type { Linkage } from '../../types/linkage';
import {
  HX_ACTION_COLUMN_DEF,
  HX_DATE_COLUMN_DEF,
  HX_SET_COLUMN_DEF,
  HX_TEXT_COLUMN_DEF,
} from '../Grid';
import ActionCellRenderer from '../Grid/ActionCellRenderer';

interface LinkageSegmentProps {
  ref?: React.Ref<HTMLDivElement>;
  linkages: Array<Linkage>;
}

const DEFAULT_FORM_DATA: Linkage = {
  id: '',
  type: '',
  details: [],
  remarks: '',
  entity1Alias: '',
  entity2Alias: '',
  startDate: '',
  endDate: '',
  createdDate: '',
  createdBy: '',
  lastUpdatedDate: '',
  lastUpdatedBy: '',
  entity1: {
    id: '',
    idNumber: '',
    type: '',
    name: '',
  },
  entity2: {
    id: '',
    idNumber: '',
    type: '',
    name: '',
  },
};

export const LinkageSegment: React.FC<LinkageSegmentProps> = ({
  ref,
  linkages = [],
}) => {
  // Linkages state
  const [linkageModalOpen, setLinkageModalOpen] = useState(false);
  const [editingLinkage, setEditingLinkage] = useState<Linkage | null>(null);
  const [linkageForm, setLinkageForm] = useState<Linkage>({
    ...DEFAULT_FORM_DATA,
  });

  const [isCreateLinkageMode, setIsCreateLinkageMode] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLinkageForm((prev) => ({
        ...prev,
        remarks: html,
      }));
    },
  });

  // Linkage handlers
  const handleEditLinkage = (linkage: Linkage) => {
    setEditingLinkage(linkage);
    setLinkageForm({
      ...linkage,
    });

    // Set the editor content
    if (editor) {
      editor.commands.setContent(linkage.remarks);
    }

    setIsCreateLinkageMode(false);
    setLinkageModalOpen(true);
  };

  const handleCreateLinkage = () => {
    setEditingLinkage(null);
    setLinkageForm({ ...DEFAULT_FORM_DATA });

    // Clear the editor content
    if (editor) {
      editor.commands.setContent('');
    }

    setIsCreateLinkageMode(true);
    setLinkageModalOpen(true);
  };

  const handleCancelLinkage = () => {
    setLinkageModalOpen(false);
    setEditingLinkage(null);
    setLinkageForm({ ...DEFAULT_FORM_DATA });

    // Clear the editor content
    if (editor) {
      editor.commands.setContent('');
    }

    setIsCreateLinkageMode(false);
  };

  const handleSaveLinkage = () => {
    if (isCreateLinkageMode) {
      console.log('Creating new linkage:', linkageForm);
    } else if (editingLinkage) {
      console.log(`Saving edit for linkage ${editingLinkage.id}:`, linkageForm);
    }

    setLinkageModalOpen(false);
    setEditingLinkage(null);
    setLinkageForm({ ...DEFAULT_FORM_DATA });
    setIsCreateLinkageMode(false);
  };
  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        id="linkages"
        ref={ref}
        mb="xl"
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3}>Linkages</Title>
            <Button
              leftSection={<IconPlus size="1rem" />}
              variant="outline"
              size="sm"
              onClick={handleCreateLinkage}
            >
              Add Linkage
            </Button>
          </Group>
          <Text c="dimmed" mb="md">
            Linkages between this entity and other entities.
          </Text>
          <div style={{ height: 400, width: '100%' }}>
            <AgGridReact
              theme={agGridTheme}
              columnDefs={[
                {
                  field: 'id',
                  headerName: 'ID',
                  ...HX_TEXT_COLUMN_DEF,
                  cellRenderer: 'agGroupCellRenderer',
                },
                {
                  field: 'type',
                  headerName: 'Type',
                  ...HX_SET_COLUMN_DEF,
                },
                {
                  field: 'entity1.idNumber',
                  headerName: 'Entity 1',
                  ...HX_TEXT_COLUMN_DEF,
                  cellRenderer: (params: { data: Linkage }) =>
                    `${params.data.entity1.idNumber} - ${params.data.entity1Alias}`,
                },
                {
                  field: 'entity2.idNumber',
                  headerName: 'Entity 2',
                  ...HX_TEXT_COLUMN_DEF,
                  cellRenderer: (params: { data: Linkage }) =>
                    `${params.data.entity2.idNumber} - ${params.data.entity2Alias}`,
                },
                {
                  field: 'startDate',
                  headerName: 'Start Date',
                  ...HX_DATE_COLUMN_DEF,
                },
                {
                  field: 'endDate',
                  headerName: 'End Date',
                  ...HX_DATE_COLUMN_DEF,
                },
                {
                  ...HX_ACTION_COLUMN_DEF,
                  cellRenderer: (props: CustomCellRendererProps) => (
                    <ActionCellRenderer<Linkage>
                      editable
                      deletable={false}
                      onEdit={() => handleEditLinkage(props.data)}
                      {...props}
                    />
                  ),
                },
              ]}
              rowData={linkages}
              defaultColDef={{
                flex: 1,
                minWidth: 100,
                resizable: true,
              }}
              pagination={true}
              paginationPageSize={20}
            />
          </div>
        </Stack>
      </Card>
      {/* Edit/Create Linkage Modal */}
      <Modal
        opened={linkageModalOpen}
        onClose={handleCancelLinkage}
        title={isCreateLinkageMode ? 'Create Linkage' : 'Edit Linkage'}
        centered
        size="xl"
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="lg">
            {/* Left Column - From Profile */}
            <Stack gap="md">
              <Title order={4} c="blue">
                Link From Profile
              </Title>

              <Select
                label="Profile Type"
                placeholder="Select profile type..."
                value={linkageForm.entity1.type}
                onChange={(value) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity1: {
                      ...prev.entity1,
                      type: (value as Linkage['entity1']['type']) || '',
                    },
                  }))
                }
                data={[
                  { value: 'person', label: 'Person' },
                  { value: 'map', label: 'Map' },
                  { value: 'book', label: 'Book' },
                  { value: 'country', label: 'Country' },
                  { value: 'abbreviations', label: 'Abbreviations' },
                ]}
                required
              />

              <TextInput
                label="Profile ID"
                placeholder="Enter profile ID..."
                value={linkageForm.entity1.idNumber}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity1: {
                      ...prev.entity1,
                      idNumber: e.target.value,
                    },
                  }))
                }
                required
              />

              <TextInput
                label="Profile Name"
                placeholder="Enter profile name..."
                value={linkageForm.entity1.name}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity1: {
                      ...prev.entity1,
                      name: e.target.value,
                    },
                  }))
                }
                required
              />
            </Stack>

            {/* Right Column - To Profile */}
            <Stack gap="md">
              <Title order={4} c="green">
                Link To Profile
              </Title>

              <Select
                label="Profile Type"
                placeholder="Select profile type..."
                value={linkageForm.entity2.type}
                onChange={(value) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity2: {
                      ...prev.entity2,
                      type: (value as Linkage['entity2']['type']) || '',
                    },
                  }))
                }
                data={[
                  { value: 'person', label: 'Person' },
                  { value: 'map', label: 'Map' },
                  { value: 'book', label: 'Book' },
                  { value: 'country', label: 'Country' },
                  { value: 'abbreviations', label: 'Abbreviations' },
                ]}
                required
              />

              <TextInput
                label="Profile ID"
                placeholder="Enter profile ID..."
                value={linkageForm.entity2.idNumber}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity2: {
                      ...prev.entity2,
                      idNumber: e.target.value,
                    },
                  }))
                }
                required
              />

              <TextInput
                label="Profile Name"
                placeholder="Enter profile name..."
                value={linkageForm.entity2.name}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    entity2: {
                      ...prev.entity2,
                      name: e.target.value,
                    },
                  }))
                }
                required
              />
            </Stack>
          </SimpleGrid>

          {/* Linkage Details - Full Width */}
          <Stack gap="md">
            <Title order={4} c="orange">
              Linkage Details
            </Title>

            <TextInput
              label="Linkage Type"
              placeholder="Enter linkage type (e.g., Colleague, Reference, etc.)..."
              value={linkageForm.type}
              onChange={(e) =>
                setLinkageForm((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              required
            />

            {/* Rich Text Editor for Remarks */}
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Remarks{' '}
                <Text component="span" c="red">
                  *
                </Text>
              </Text>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content style={{ minHeight: '200px' }} />
              </RichTextEditor>
              <Text size="xs" c="dimmed">
                Use the rich text editor to format your remarks with bold,
                italic, lists, links, and more.
              </Text>
            </Stack>
          </Stack>

          {editingLinkage && !isCreateLinkageMode && (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                <strong>Created:</strong>{' '}
                {new Date(editingLinkage.createdDate).toLocaleDateString()} by{' '}
                {editingLinkage.createdBy}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Last modified:</strong>{' '}
                {new Date(editingLinkage.lastUpdatedDate).toLocaleDateString()}{' '}
                by {editingLinkage.lastUpdatedBy}
              </Text>
            </Stack>
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={handleCancelLinkage}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveLinkage}
              disabled={
                !linkageForm.entity1.type ||
                !linkageForm.entity1.idNumber ||
                !linkageForm.entity1.name ||
                !linkageForm.entity2.type ||
                !linkageForm.entity2.idNumber ||
                !linkageForm.entity2.name ||
                !linkageForm.type ||
                !linkageForm.remarks.trim()
              }
            >
              {isCreateLinkageMode ? 'Create' : 'Save Changes'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
