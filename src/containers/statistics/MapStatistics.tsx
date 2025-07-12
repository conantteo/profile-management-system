import {
  Box,
  Button,
  Card,
  Container,
  Group,
  Table,
  Title,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const mapData = {
  id: '1',
  name: 'Golden Gate Bridge',
  location: 'San Francisco, CA',
  coordinates: '37.8199° N, 122.4783° W',
  length: '2,737 meters',
  opened: '1937',
  description:
    'Iconic suspension bridge connecting San Francisco and Marin County',
  specifications: {
    height: '227 meters',
    width: '27.4 meters',
    materials: ['Steel', 'Concrete', 'Cable wire'],
    architect: 'Joseph Strauss',
    cost: '$35 million (1937)',
  },
  locationDetails: {
    city: 'San Francisco',
    state: 'California',
    country: 'United States',
    nearbyLandmarks: [
      'Alcatraz Island',
      "Fisherman's Wharf",
      'Presidio',
      'Marin Headlands',
    ],
    accessibility: 'Pedestrian walkways, bike lanes, vehicle access',
  },
  gallery: {
    mainImage: '/images/golden-gate-main.jpg',
    additionalImages: [
      '/images/gg-sunset.jpg',
      '/images/gg-fog.jpg',
      '/images/gg-aerial.jpg',
    ],
    virtualTour: 'https://virtualtour.goldengate.org',
  },
  historicalFacts: [
    'Construction began in 1933 during the Great Depression',
    'It was the longest suspension bridge in the world until 1964',
    "The bridge's International Orange color was chosen for visibility in fog",
    'Over 2 billion vehicles have crossed the bridge since opening',
    "It's considered one of the Wonders of the Modern World",
    'The bridge sways up to 27 feet in strong winds',
    'It took 4 years to complete construction',
    'The bridge has appeared in numerous movies and TV shows',
  ],
};

export function MapStatistics() {
  const navigate = useNavigate();

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Group mb="md" align="center">
          <Title order={2}>Map Statistics</Title>
        </Group>
      </Card>
      <Box style={{ overflowX: 'auto', width: '100%' }}>
        <Table
          striped
          highlightOnHover
          withTableBorder
          withColumnBorders
          style={{ minWidth: 1200 }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Coordinates</Table.Th>
              <Table.Th>Length</Table.Th>
              <Table.Th>Opened</Table.Th>
              <Table.Th
                style={{
                  position: 'sticky',
                  right: 0,
                  background: '#fff',
                  zIndex: 1,
                  minWidth: 100,
                }}
              >
                Action
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>{mapData.name}</Table.Td>
              <Table.Td>{mapData.location}</Table.Td>
              <Table.Td>{mapData.coordinates}</Table.Td>
              <Table.Td>{mapData.length}</Table.Td>
              <Table.Td>{mapData.opened}</Table.Td>

              <Table.Td
                style={{
                  position: 'sticky',
                  right: 0,
                  background: '#fff',
                  zIndex: 1,
                  minWidth: 100,
                }}
              >
                <Button
                  onClick={() => navigate(`/profile/map/${mapData.id}`)}
                  variant="filled"
                  size="xs"
                >
                  Open
                </Button>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Box>
    </Container>
  );
}
