import {
  Badge,
  Box,
  Card,
  Container,
  Group,
  NavLink,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconHistory,
  IconInfoCircle,
  IconMapPin,
  IconPhoto,
  IconRuler,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

interface MapData {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  length: string;
  opened: string;
  description: string;
  specifications: {
    height: string;
    width: string;
    materials: string[];
    architect: string;
    cost: string;
  };
  locationDetails: {
    city: string;
    state: string;
    country: string;
    nearbyLandmarks: string[];
    accessibility: string;
  };
  gallery: {
    mainImage: string;
    additionalImages: string[];
    virtualTour: string;
  };
  historicalFacts: string[];
}

export function MapProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'basic-info'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);

  // Mock data - replace with actual API call
  const mapData: MapData = {
    id: id || '1',
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

  const sections = useMemo(() => [
    {
      id: 'basic-info',
      label: 'Basic Information',
      icon: IconInfoCircle,
    },
    {
      id: 'specifications',
      label: 'Specifications',
      icon: IconRuler,
    },
    {
      id: 'location-details',
      label: 'Location Details',
      icon: IconMapPin,
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: IconPhoto,
    },
    {
      id: 'historical-facts',
      label: 'Historical Facts',
      icon: IconHistory,
    },
  ], []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && sections.find((s) => s.id === section)) {
      setActiveSection(section);
      setTimeout(() => {
        const element = sectionRefs.current[section];
        if (element) {
          isScrollingToSection.current = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            isScrollingToSection.current = false;
          }, 1000);
        }
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToSection.current) return;

        let mostVisibleSection = null;
        let maxIntersectionRatio = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxIntersectionRatio) {
            maxIntersectionRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection && mostVisibleSection !== activeSection) {
          setActiveSection(mostVisibleSection);
          setSearchParams({ section: mostVisibleSection });
        }
      },
      {
        root: null,
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [activeSection, setSearchParams]);

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    setSearchParams({ section: sectionId });

    isScrollingToSection.current = true;

    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 1000);
    }
  };

  const renderBasicInfo = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="basic-info"
      ref={(el) => {
        sectionRefs.current['basic-info'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Basic Information</Title>

        <Group gap="xs">
          <Text fw={500}>Name:</Text>
          <Text>{mapData.name}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Location:</Text>
          <Text>{mapData.location}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Coordinates:</Text>
          <Text>{mapData.coordinates}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Length:</Text>
          <Text>{mapData.length}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Opened:</Text>
          <Text>{mapData.opened}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Description:</Text>
          <Text ml="md">{mapData.description}</Text>
        </Stack>
      </Stack>
    </Card>
  );

  const renderSpecifications = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="specifications"
      ref={(el) => {
        sectionRefs.current['specifications'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Technical Specifications</Title>
        <Text c="dimmed" mb="md">
          Detailed technical information about the structure and construction.
        </Text>

        <Group gap="xs">
          <Text fw={500}>Height:</Text>
          <Text>{mapData.specifications.height}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Width:</Text>
          <Text>{mapData.specifications.width}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Architect:</Text>
          <Text>{mapData.specifications.architect}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Construction Cost:</Text>
          <Text>{mapData.specifications.cost}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Materials Used:</Text>
          <Group gap="xs" ml="md">
            {mapData.specifications.materials.map((material) => (
              <Badge key={material} variant="outline" color="green">
                {material}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );

  const renderLocationDetails = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="location-details"
      ref={(el) => {
        sectionRefs.current['location-details'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Location Details</Title>

        <Group gap="xs">
          <Text fw={500}>City:</Text>
          <Text>{mapData.locationDetails.city}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>State:</Text>
          <Text>{mapData.locationDetails.state}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Country:</Text>
          <Text>{mapData.locationDetails.country}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Accessibility:</Text>
          <Text>{mapData.locationDetails.accessibility}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Nearby Landmarks:</Text>
          <Stack gap="xs" ml="md">
            {mapData.locationDetails.nearbyLandmarks.map((landmark, index) => (
              <Text key={index}>• {landmark}</Text>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderGallery = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="gallery"
      ref={(el) => {
        sectionRefs.current['gallery'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Gallery & Media</Title>
        <Text c="dimmed" mb="md">
          Visual content and media resources for this location.
        </Text>

        <Stack gap="xs">
          <Text fw={500}>Main Image:</Text>
          <Text ml="md" c="dimmed">
            {mapData.gallery.mainImage}
          </Text>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Additional Images:</Text>
          <Stack gap="xs" ml="md">
            {mapData.gallery.additionalImages.map((image, index) => (
              <Text key={index} c="dimmed">
                • {image}
              </Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Virtual Tour:</Text>
          <Text
            ml="md"
            c="blue"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
          >
            {mapData.gallery.virtualTour}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );

  const renderHistoricalFacts = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="historical-facts"
      ref={(el) => {
        sectionRefs.current['historical-facts'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Historical Facts</Title>
        <Text c="dimmed" mb="md">
          Interesting historical information and milestones.
        </Text>
        <Stack gap="sm">
          {mapData.historicalFacts.map((fact, index) => (
            <Group key={index} gap="xs" align="flex-start">
              <Text c="green" fw={500}>
                {index + 1}.
              </Text>
              <Text>{fact}</Text>
            </Group>
          ))}
        </Stack>
      </Stack>
    </Card>
  );

  return (
    <Container fluid py="xl">
      <Stack gap="lg">
        {/* Header Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Title order={2}>{mapData.name}</Title>
            <Text size="lg" fw={500} c="dimmed">
              {mapData.location}
            </Text>
            <Badge color="green" variant="light">
              Map Location
            </Badge>
          </Stack>
          <Text mt="md">{mapData.description}</Text>
        </Card>

        {/* Main Content Layout */}
        <SimpleGrid cols={4} spacing="lg" style={{ alignItems: 'flex-start' }}>
          {/* Left Navigation - Sticky */}
          <Card
            shadow="sm"
            padding="md"
            radius="md"
            withBorder
            style={{
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
              maxHeight: 'calc(100vh - 40px)',
              overflow: 'auto',
              alignSelf: 'flex-start',
            }}
          >
            <Stack gap="xs">
              <Title order={4} mb="sm">
                Sections
              </Title>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <NavLink
                    key={section.id}
                    label={section.label}
                    leftSection={<Icon size={16} />}
                    active={activeSection === section.id}
                    onClick={() => handleSectionChange(section.id)}
                    style={{
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                );
              })}
            </Stack>
          </Card>

          {/* Main Content - Scrollable */}
          <Box style={{ gridColumn: 'span 3' }}>
            <Stack gap={0}>
              {renderBasicInfo()}
              {renderSpecifications()}
              {renderLocationDetails()}
              {renderGallery()}
              {renderHistoricalFacts()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
