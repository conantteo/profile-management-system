import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  description: string;
  data: any;
}

const categories = [
  { id: 'person', label: 'Person' },
  { id: 'map', label: 'Map' },
  { id: 'book', label: 'Book' },
  { id: 'countries', label: 'Countries' },
  { id: 'abbreviations', label: 'Abbreviations' },
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(
    null
  );
  const [results, setResults] = useState<SearchResult[]>([]);

  // Mock search results - replace with actual API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'John Doe',
      category: 'person',
      description: 'Software Engineer at Tech Corp',
      data: {
        name: 'John Doe',
        position: 'Software Engineer',
        company: 'Tech Corp',
        email: 'john.doe@techcorp.com',
        location: 'San Francisco, CA',
      },
    },
    {
      id: '2',
      title: 'Jane Smith',
      category: 'person',
      description: 'Product Manager at StartupXYZ',
      data: {
        name: 'Jane Smith',
        position: 'Product Manager',
        company: 'StartupXYZ',
        email: 'jane.smith@startupxyz.com',
        location: 'New York, NY',
      },
    },
    {
      id: '3',
      title: 'Golden Gate Bridge',
      category: 'map',
      description: 'Iconic suspension bridge in San Francisco',
      data: {
        name: 'Golden Gate Bridge',
        location: 'San Francisco, CA',
        coordinates: '37.8199° N, 122.4783° W',
        length: '2,737 meters',
        opened: '1937',
      },
    },
  ];

  useEffect(() => {
    // Simulate search API call
    const filteredResults = mockResults.filter((result) => {
      const matchesQuery =
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || result.category === selectedCategory;
      return matchesQuery && matchesCategory;
    });

    setResults(filteredResults);
    if (filteredResults.length > 0) {
      setSelectedResult(filteredResults[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  const handleNavigateToProfile = () => {
    if (!selectedResult) return;

    const routeMap: { [key: string]: string } = {
      person: `/profile/person/${selectedResult.id}`,
      map: `/profile/map/${selectedResult.id}`,
      book: `/profile/book/${selectedResult.id}`,
      countries: `/profile/country/${selectedResult.id}`,
      abbreviations: `/profile/abbreviation/${selectedResult.id}`,
    };

    const route = routeMap[selectedResult.category];
    if (route) {
      navigate(route);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      person: 'blue',
      map: 'green',
      book: 'orange',
      countries: 'purple',
      abbreviations: 'red',
    };
    return colors[category] || 'gray';
  };

  const renderPreview = (result: SearchResult) => {
    if (!result) return null;

    switch (result.category) {
      case 'person':
        return (
          <Stack gap="md">
            <Title order={3}>{result.data.name}</Title>
            <Text size="lg" fw={500}>
              {result.data.position}
            </Text>
            <Text c="dimmed">{result.data.company}</Text>
            <Group gap="xs">
              <Text fw={500}>Email:</Text>
              <Text>{result.data.email}</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Location:</Text>
              <Text>{result.data.location}</Text>
            </Group>
          </Stack>
        );
      case 'map':
        return (
          <Stack gap="md">
            <Title order={3}>{result.data.name}</Title>
            <Text>{result.description}</Text>
            <Group gap="xs">
              <Text fw={500}>Location:</Text>
              <Text>{result.data.location}</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Coordinates:</Text>
              <Text>{result.data.coordinates}</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Length:</Text>
              <Text>{result.data.length}</Text>
            </Group>
            <Group gap="xs">
              <Text fw={500}>Opened:</Text>
              <Text>{result.data.opened}</Text>
            </Group>
          </Stack>
        );
      default:
        return (
          <Stack gap="md">
            <Title order={3}>{result.title}</Title>
            <Text>{result.description}</Text>
            <Text c="dimmed">Category: {result.category}</Text>
          </Stack>
        );
    }
  };

  return (
    <Container
      fluid
      style={{
        height: '100vh',
        paddingTop: '20px',
        paddingBottom: '20px',
      }}
    >
      <SimpleGrid cols={2} style={{ height: '100%', gap: '16px' }}>
        {/* Left side - Search bar and results */}
        <Stack gap="md" style={{ height: '100%' }}>
          {/* Search bar */}
          <Card shadow="sm" p="md" radius="md" withBorder>
            <SearchBar
              selectedCategory={selectedCategory}
              query={searchQuery}
              setQuery={setSearchQuery}
            />
            <Group justify="center" gap="xs" mt="lg" wrap="wrap">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'filled' : 'light'
                  }
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
          </Card>

          {/* Search results */}
          <Card shadow="sm" radius="md" withBorder style={{ flex: 1 }}>
            <Card.Section p="md" withBorder>
              <Title order={4}>Search Results ({results.length})</Title>
            </Card.Section>
            <ScrollArea style={{ height: 'calc(100% - 60px)' }}>
              <Stack gap="xs" p="md">
                {results.map((result) => (
                  <Card
                    key={result.id}
                    shadow="xs"
                    radius="md"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor:
                        selectedResult?.id === result.id ? '#f8f9fa' : 'white',
                      borderColor:
                        selectedResult?.id === result.id
                          ? '#228be6'
                          : '#dee2e6',
                    }}
                    onClick={() => setSelectedResult(result)}
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={500}>{result.title}</Text>
                        <Badge
                          color={getCategoryColor(result.category)}
                          variant="light"
                          size="sm"
                        >
                          {result.category}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {result.description}
                      </Text>
                    </Stack>
                  </Card>
                ))}
                {results.length === 0 && (
                  <Text c="dimmed" ta="center" py="xl">
                    No results found for "{searchQuery}"
                  </Text>
                )}
              </Stack>
            </ScrollArea>
          </Card>
        </Stack>

        {/* Right side - Preview (full height) */}
        <Card shadow="sm" radius="md" withBorder style={{ height: '100%' }}>
          <Card.Section p="md" withBorder>
            <Group justify="space-between" align="center">
              <Title order={4}>Preview</Title>
              {selectedResult && (
                <Button
                  variant="light"
                  size="sm"
                  leftSection={<IconExternalLink size={16} />}
                  onClick={handleNavigateToProfile}
                >
                  View Profile
                </Button>
              )}
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 'calc(100% - 60px)' }}>
            <Box p="md">
              {selectedResult ? (
                renderPreview(selectedResult)
              ) : (
                <Text c="dimmed" ta="center" py="xl">
                  Select a result to view details
                </Text>
              )}
            </Box>
          </ScrollArea>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
