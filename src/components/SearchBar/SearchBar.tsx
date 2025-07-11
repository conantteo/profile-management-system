import {
  ActionIcon,
  Button,
  Group,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchField: string;
  setSearchField: (field: string) => void;
  onSearch: () => void;
  placeholder?: string;
  showCategories?: boolean;
  centerCategories?: boolean;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  searchField,
  setSearchField,
  onSearch,
  placeholder = 'Search profiles, entities, or data...',
  showCategories = true,
  centerCategories = true,
}: SearchBarProps) {
  const categories = [
    { id: 'person', label: 'Person' },
    { id: 'map', label: 'Map' },
    { id: 'book', label: 'Book' },
    { id: 'countries', label: 'Countries' },
    { id: 'abbreviations', label: 'Abbreviations' },
  ];

  return (
    <Stack style={{ width: '100%' }}>
      <Group gap={0} style={{ width: '100%' }}>
        <Select
          value={searchField}
          onChange={(value) => setSearchField(value || 'all')}
          data={[
            { value: 'all', label: 'All' },
            { value: 'name', label: 'Name' },
          ]}
          style={{
            flexShrink: 0,
            minWidth: 120,
          }}
          styles={{
            input: {
              borderBottomLeftRadius: '16px',
              borderTopLeftRadius: '16px',
              borderRight: 'none',
              borderBottomRightRadius: '0',
              borderTopRightRadius: '0',
            },
          }}
          comboboxProps={{
            transitionProps: { transition: 'pop', duration: 200 },
          }}
        />
        <TextInput
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearch();
            }
          }}
          placeholder={placeholder}
          style={{ flex: 1 }}
          styles={{
            input: {
              borderBottomRightRadius: '16px',
              borderTopRightRadius: '16px',
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            },
          }}
          rightSection={
            <Group gap="xs" pr="sm">
              <ActionIcon variant="subtle" color="gray" onClick={onSearch}>
                <IconSearch size={20} />
              </ActionIcon>
            </Group>
          }
        />
      </Group>

      {showCategories && (
        <Group
          justify={centerCategories ? 'center' : 'flex-start'}
          gap="xs"
          mt="lg"
          wrap="wrap"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'filled' : 'light'}
              size="sm"
              radius="xl"
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )
              }
              style={{
                transition: 'all 0.2s ease',
                minWidth: 'auto',
                padding: '8px 16px',
              }}
            >
              {category.label}
            </Button>
          ))}
        </Group>
      )}
    </Stack>
  );
}
