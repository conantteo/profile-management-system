import {
  ActionIcon,
  Autocomplete,
  Button,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

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

interface HighlightedProps {
  suggestion: string;
  query: string;
}

const Highlighted = ({ suggestion, query }: HighlightedProps) => {
  if (!query) return suggestion;
  const parts: string[] = suggestion.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, idx) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <Text component="span" fw={700} c="blue" key={idx}>
            {part}
          </Text>
        ) : (
          <Text component="span" key={idx}>
            {part}
          </Text>
        )
      )}
    </>
  );
};

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

  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Sync local input with external searchQuery prop
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced suggestions update
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue);
      if (inputValue.trim() !== '') {
        const results = mockSearch(inputValue, searchField);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, setSearchQuery, searchField]);

  // Mock search function (replace with real API call as needed)
  function mockSearch(query: string, field: string): string[] {
    const data = [
      'Alice Johnson',
      'Bob Smith',
      'Charlie Brown',
      'David Wilson',
      'Eve Davis',
      'Frank Miller',
      'Grace Lee',
      'Hannah Taylor',
    ];
    if (field === 'name' || field === 'all') {
      return data.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
    }
    return [];
  }

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
        <Autocomplete
          value={inputValue}
          onChange={setInputValue}
          data={suggestions}
          placeholder={placeholder}
          maxDropdownHeight={200}
          comboboxProps={{ withinPortal: true }}
          limit={5}
          renderOption={(option) => (
            <div>
              <Highlighted
                suggestion={option.option.value}
                query={inputValue}
              />
            </div>
          )}
          style={{ flex: 1 }}
          styles={{
            input: {
              borderBottomRightRadius: '16px',
              borderTopRightRadius: '16px',
              borderBottomLeftRadius: 0,
              borderTopLeftRadius: 0,
            },
            dropdown: {
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              borderRadius: 8,
              zIndex: 9999,
            },
          }}
          rightSection={
            <Group gap="xs" pr="sm">
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => {
                  onSearch();
                  setSuggestions([]);
                }}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Group>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearch();
              setSuggestions([]);
            }
          }}
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
