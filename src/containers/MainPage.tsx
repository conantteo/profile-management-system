import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';

export function MainPage() {
  const categories = [
    { id: 'person', label: 'Person' },
    { id: 'map', label: 'Map' },
    { id: 'book', label: 'Book' },
    { id: 'countries', label: 'Countries' },
    { id: 'abbreviations', label: 'Abbreviations' },
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <Container
      size="md"
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 80, // Account for left navigation
      }}
    >
      <Stack align="center" gap="xl" style={{ width: '100%', maxWidth: 600 }}>
        <Title order={1} ta="center">
          Profile Management System
        </Title>

        <SearchBar selectedCategory={selectedCategory} />

        <Group justify="center" gap="xs" mt="lg" wrap="wrap">
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
      </Stack>
    </Container>
  );
}
