import {
  Container,
  Stack,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';

export function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchField, setSearchField] = useState<string>('all');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery,
        field: searchField,
        ...(selectedCategory && { category: selectedCategory }),
      });
      navigate(`/search?${searchParams.toString()}`);
    }
  };

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

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchField={searchField}
          setSearchField={setSearchField}
          onSearch={handleSearch}
        />
      </Stack>
    </Container>
  );
}
