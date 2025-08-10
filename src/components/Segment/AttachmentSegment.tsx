import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  List,
  ScrollArea,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import React, { useState } from 'react';
import type { Attachment, Folder } from '../../types/attachment';
import { generateId } from '../../utils/commonUtils';
import { AttachmentModal } from './AttachmentModal';

interface AttachmentSegmentProps {
  ref?: React.Ref<HTMLDivElement>;
}

export const AttachmentSegment: React.FC<AttachmentSegmentProps> = ({
  ref,
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const [folderModalOpened, setFolderModalOpened] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  // Files being added/edited in the modal
  const [modalFiles, setModalFiles] = useState<Attachment[]>([]);

  // State to track editing file descriptions inline
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [fileDescEditValue, setFileDescEditValue] = useState('');

  // Open modal for creating a new folder
  function openNewFolderModal() {
    setModalFiles([]);
    setFolderModalOpened(true);
  }

  // Open modal for editing existing folder
  function openEditFolderModal(folder: Folder) {
    setFolderName(folder.name);
    setFolderDescription('');
    setEditingFolderId(folder.id);
    setModalFiles([...folder.files]); // clone
    setFolderModalOpened(true);
  }

  // Select folder from list
  function selectFolder(id: string) {
    setSelectedFolderId(id);
    setEditingFileId(null);
  }

  // Add new file directly to existing folder (not modal - inline)
  function addFileToFolder(folderId: string) {
    const newFile: Attachment = { id: generateId(), name: '', description: '' };
    setFolders((current) =>
      current.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: [...folder.files, newFile] }
          : folder
      )
    );
    setEditingFileId(newFile.id);
    setFileDescEditValue('');
  }

  // Delete file from folder
  function deleteFileFromFolder(folderId: string, fileId: string) {
    setFolders((current) =>
      current.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: folder.files.filter((f) => f.id !== fileId) }
          : folder
      )
    );
    if (editingFileId === fileId) {
      setEditingFileId(null);
    }
  }

  // Begin editing file description
  function beginEditFileDescription(file: Attachment) {
    setEditingFileId(file.id);
    setFileDescEditValue(file.description);
  }

  // Save edited file description
  function saveFileDescription(folderId: string, fileId: string) {
    setFolders((current) =>
      current.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              files: folder.files.map((f) =>
                f.id === fileId ? { ...f, description: fileDescEditValue } : f
              ),
            }
          : folder
      )
    );
    setEditingFileId(null);
  }

  // Cancel editing file desc
  function cancelEditFileDesc() {
    setEditingFileId(null);
  }

  // Rename folder inline
  function renameFolder(folderId: string, newName: string) {
    setFolders((current) =>
      current.map((folder) =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    );
  }

  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        id="attachment"
        ref={ref}
        mb="xl"
      >
        <Group justify="space-between" mb="md">
          <Title order={3}>Attachments</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openNewFolderModal}
          >
            New Folder
          </Button>
        </Group>

        <Group align="flex-start" gap="xl" wrap="nowrap">
          {/* Folder list */}
          <Box
            style={{
              flexBasis: 250,
              borderRight: '1px solid #ddd',
              paddingRight: '1rem',
            }}
          >
            <Title order={5} mb="sm">
              Folders
            </Title>
            <ScrollArea style={{ height: 400 }}>
              <List size="sm" withPadding>
                {folders.length === 0 && (
                  <Text color="dimmed" size="sm">
                    No folders found. Create one above.
                  </Text>
                )}
                {folders.map((folder) => (
                  <List.Item
                    key={folder.id}
                    style={{
                      cursor: 'pointer',
                      backgroundColor:
                        folder.id === selectedFolderId ? '#f0f0f0' : undefined,
                      padding: '6px 8px',
                      borderRadius: 4,
                      marginBottom: 4,
                    }}
                    onClick={() => selectFolder(folder.id)}
                  >
                    <Group gap="xs" justify="space-between" wrap="nowrap">
                      <Text
                        size="sm"
                        fw={folder.id === selectedFolderId ? 700 : 400}
                        style={{ flexGrow: 1 }}
                        onDoubleClick={() => {
                          // Rename folder inline
                          const newName = prompt(
                            'Edit folder name',
                            folder.name
                          );
                          if (newName && newName.trim()) {
                            renameFolder(folder.id, newName.trim());
                          }
                        }}
                      >
                        {folder.name}
                      </Text>
                      <ActionIcon
                        color="blue"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditFolderModal(folder);
                        }}
                        title="Edit folder"
                      >
                        <IconEdit size={14} />
                      </ActionIcon>
                    </Group>
                  </List.Item>
                ))}
              </List>
            </ScrollArea>
          </Box>

          {/* Folder files */}
          <Box style={{ flex: 1 }}>
            {selectedFolder ? (
              <>
                <Group
                  justify="space-between"
                  mb="sm"
                  align="center"
                  wrap="nowrap"
                >
                  <Title order={4}>{selectedFolder.name} - Files</Title>
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={16} />}
                    onClick={() => addFileToFolder(selectedFolder.id)}
                  >
                    Add File
                  </Button>
                </Group>
                <Divider mb="sm" />
                <ScrollArea style={{ height: 400 }}>
                  {selectedFolder.files.length === 0 && (
                    <Text color="dimmed">No files in this folder.</Text>
                  )}
                  <List size="sm" withPadding>
                    {selectedFolder.files.map((file) => (
                      <List.Item key={file.id}>
                        <Group wrap="nowrap" align="flex-start" gap="md">
                          <Box style={{ flexBasis: 180 }}>
                            <Text fw={500}>
                              {file.name || (
                                <Text color="red" size="xs" inline>
                                  (Unnamed file)
                                </Text>
                              )}
                            </Text>
                          </Box>
                          <Box style={{ flex: 1, minWidth: 50 }}>
                            {editingFileId === file.id ? (
                              <Textarea
                                autosize
                                minRows={2}
                                value={fileDescEditValue}
                                onChange={(e) =>
                                  setFileDescEditValue(e.currentTarget.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    saveFileDescription(
                                      selectedFolder.id,
                                      file.id
                                    );
                                  } else if (e.key === 'Escape') {
                                    cancelEditFileDesc();
                                  }
                                }}
                              />
                            ) : (
                              <Text
                                onDoubleClick={() =>
                                  beginEditFileDescription(file)
                                }
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  cursor: 'pointer',
                                }}
                              >
                                {file.description || (
                                  <Text color="dimmed">(No description)</Text>
                                )}
                              </Text>
                            )}
                          </Box>
                          <Group gap={4} wrap="nowrap">
                            {editingFileId === file.id ? (
                              <>
                                <ActionIcon
                                  color="green"
                                  onClick={() =>
                                    saveFileDescription(
                                      selectedFolder.id,
                                      file.id
                                    )
                                  }
                                  title="Save description"
                                >
                                  <IconCheck size={18} />
                                </ActionIcon>
                                <ActionIcon
                                  color="red"
                                  onClick={cancelEditFileDesc}
                                  title="Cancel editing"
                                >
                                  <IconX size={18} />
                                </ActionIcon>
                              </>
                            ) : (
                              <ActionIcon
                                color="red"
                                onClick={() =>
                                  deleteFileFromFolder(
                                    selectedFolder.id,
                                    file.id
                                  )
                                }
                                title="Delete file"
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Group>
                      </List.Item>
                    ))}
                  </List>
                </ScrollArea>
              </>
            ) : (
              <Text c="dimmed" style={{ marginTop: 80 }}>
                Select a folder to view its files
              </Text>
            )}
          </Box>
        </Group>
      </Card>
      {folderModalOpened && (
        <AttachmentModal
          id={editingFolderId}
          name={folderName}
          description={folderDescription}
          files={modalFiles}
          onClose={() => setFolderModalOpened(false)}
        />
      )}
    </>
  );
};
