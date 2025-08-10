import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import React, { useEffect, useState } from 'react';
import type { Attachment } from '../../types/attachment';
import { generateId } from '../../utils/commonUtils';

interface AttachmentModalProps {
  id: string | null;
  name: string;
  description?: string;
  files: Array<Attachment>;
  onClose: () => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  id = '',
  name = '',
  description = '',
  files = [],
  onClose = () => {},
}) => {
  // Modal state for creating/editing folder
  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [modalFiles, setModalFiles] = useState<Attachment[]>([]);

  useEffect(() => {
    if (id) setEditingFolderId(id);
    if (name) setFolderName(name);
    if (description) setFolderDescription(description);
    if (files) setModalFiles(files);
  }, [description, files, id, name]);

  function handleDropzoneFiles(files: File[]) {
    const newEntries: Attachment[] = files.map((f) => ({
      id: generateId(),
      name: f.name,
      description: '',
    }));
    setModalFiles((current) => [...current, ...newEntries]);
  }

  // Save changes from modal to main folders state
  function saveFolder() {
    if (!folderName.trim()) {
      alert('Folder name is required');
      return;
    }
    if (modalFiles.some((f) => !f.name.trim())) {
      alert('All files must have a name');
      return;
    }

    if (editingFolderId) {
      // Edit existing folder
    } else {
      // Create new folder
    }
    onClose();
  }
  return (
    <Modal
      opened
      onClose={onClose}
      title={editingFolderId ? 'Edit Folder' : 'New Folder'}
      size="lg"
    >
      <Stack>
        <TextInput
          label="Folder Name"
          placeholder="Enter folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Description"
          placeholder="Enter folder description"
          value={folderDescription}
          onChange={(e) => setFolderDescription(e.currentTarget.value)}
        />
        <Title order={6}>Files</Title>
        <Dropzone
          multiple
          onDrop={handleDropzoneFiles}
          maxSize={30 * 1024 ** 2}
        >
          <Text size="sm">Drag files here or click to select</Text>
        </Dropzone>
        <MultiSelect
          label="Files added"
          placeholder="Uploaded file(s)"
          data={modalFiles.map((f) => ({ value: f.id, label: f.name }))}
          value={modalFiles.map((f) => f.id)}
          onChange={(values) => {
            setModalFiles((current) =>
              current.filter((f) => values.includes(f.id))
            );
          }}
          searchable
          clearable
          nothingFoundMessage="No files"
        />
        <Group justify="end" gap="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveFolder}>
            {editingFolderId ? 'Save Changes' : 'Create Folder'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
