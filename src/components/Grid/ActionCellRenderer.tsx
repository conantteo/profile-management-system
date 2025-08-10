import { ActionIcon, Menu } from '@mantine/core';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons-react';
import type { CustomCellRendererProps } from 'ag-grid-react';

interface ActionCellRendererProps<T> extends CustomCellRendererProps<T> {
  editable: boolean;
  deletable: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionCellRenderer = <T,>({
  editable = true,
  deletable = false,
  onEdit = () => {},
  onDelete = () => {},
}: ActionCellRendererProps<T>) => {
  // props.node.data contains your row data

  const handleEdit = () => {
    onEdit();
    // Custom edit logic here, using props.node.data
  };

  const handleDelete = () => {
    onDelete();
    // Custom delete logic here
  };

  return (
    <Menu shadow="md" width={160} withArrow>
      <Menu.Target>
        <ActionIcon variant="subtle" color="gray" aria-label="Actions">
          <IconDots size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {editable && (
          <Menu.Item
            leftSection={<IconPencil size={16} />}
            onClick={handleEdit}
          >
            Edit
          </Menu.Item>
        )}
        {deletable && (
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} />}
            onClick={handleDelete}
          >
            Delete
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionCellRenderer;
