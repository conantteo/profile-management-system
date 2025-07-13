import {
  ActionIcon,
  Autocomplete,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  selectedCategory: string | null;
  setQuery?: (query: string) => void;
  query?: string;
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
  placeholder = 'Search profiles, entities, or data...',
  selectedCategory,
  query,
  setQuery,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [searchField, setSearchField] = useState<string>('all');
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  const handleSearch = (suggestedSearchQuery?: string) => {
    const queryToSearch = suggestedSearchQuery || searchQuery;
    if (queryToSearch.trim()) {
      if (setQuery) setQuery(queryToSearch);
      const searchParams = new URLSearchParams({
        q: queryToSearch,
        field: searchField,
        ...(selectedCategory && { category: selectedCategory }),
      });
      navigate(`/search?${searchParams.toString()}`);
    }
  };

  // Debounced suggestions update
  useEffect(() => {
    if (debouncedSearchQuery.trim() !== '') {
      const results = mockSearch(debouncedSearchQuery, searchField);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery, searchField, setQuery]);

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
          value={searchQuery}
          onChange={setSearchQuery}
          data={suggestions}
          placeholder={placeholder}
          maxDropdownHeight={200}
          comboboxProps={{ withinPortal: true }}
          limit={5}
          renderOption={(option) => (
            <div>
              <Highlighted
                suggestion={option.option.value}
                query={searchQuery}
              />
            </div>
          )}
          onOptionSubmit={(value) => {
            setSearchQuery(value);
            handleSearch(value);
            setSuggestions([]);
          }}
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
                  handleSearch();
                  setSuggestions([]);
                }}
              >
                <IconSearch size={20} />
              </ActionIcon>
            </Group>
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
              setSuggestions([]);
            }
          }}
        />
      </Group>
    </Stack>
  );
}
