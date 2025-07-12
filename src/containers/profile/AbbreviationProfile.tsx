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
  IconBook2,
  IconCategory,
  IconInfoCircle,
  IconListDetails,
  IconTags,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

export function AbbreviationProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'overview'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);

  // Mock data - replace with actual API call
  const abbreviationData = {
    id: id,
    abbreviation: 'API',
    fullForm: 'Application Programming Interface',
    category: 'Technology',
    field: 'Software Development',
    definition:
      'A set of protocols, routines, and tools for building software applications. It specifies how software components should interact and allows different software applications to communicate with each other.',
    usage:
      'Commonly used in web development, mobile app development, and system integration',
    examples: [
      'REST API - for web services',
      'GraphQL API - for flexible data queries',
      'Twitter API - for accessing Twitter data',
      'Google Maps API - for location services',
    ],
    relatedTerms: ['SDK', 'REST', 'HTTP', 'JSON', 'XML'],
    firstUsed: '1960s',
    pronunciation: 'A-P-I (spelled out)',
  };

  const sections = useMemo(() => [
    {
      id: 'overview',
      label: 'Overview',
      icon: IconInfoCircle,
    },
    {
      id: 'classification',
      label: 'Classification',
      icon: IconCategory,
    },
    {
      id: 'usage-examples',
      label: 'Usage & Examples',
      icon: IconListDetails,
    },
    {
      id: 'related-terms',
      label: 'Related Terms',
      icon: IconTags,
    },
  ], []);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section && sections.find((s) => s.id === section)) {
      setActiveSection(section);
      // Scroll to section after component mounts
      setTimeout(() => {
        const element = sectionRefs.current[section];
        if (element) {
          isScrollingToSection.current = true;
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Reset the flag after scrolling is complete
          setTimeout(() => {
            isScrollingToSection.current = false;
          }, 1000);
        }
      }, 100);
    }
  }, [searchParams, sections]);

  // Intersection Observer to update active section based on scroll position
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Don't update active section if we're programmatically scrolling
        if (isScrollingToSection.current) return;

        // Find the section that's most visible
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

    // Set flag to prevent intersection observer from interfering
    isScrollingToSection.current = true;

    // Scroll to section
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Reset the flag after scrolling is complete
      setTimeout(() => {
        isScrollingToSection.current = false;
      }, 1000);
    }
  };

  const renderOverview = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="overview"
      ref={(el) => {
        sectionRefs.current['overview'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Overview</Title>
        <Text>{abbreviationData.definition}</Text>
        <Group gap="xs">
          <Text fw={500}>Full Form:</Text>
          <Text>{abbreviationData.fullForm}</Text>
        </Group>
      </Stack>
    </Card>
  );

  const renderClassification = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="classification"
      ref={(el) => {
        sectionRefs.current['classification'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Classification</Title>
        <Group gap="xs">
          <IconCategory size={16} />
          <Text fw={500}>Category:</Text>
          <Text>{abbreviationData.category}</Text>
        </Group>
        <Group gap="xs">
          <IconBook2 size={16} />
          <Text fw={500}>Field:</Text>
          <Text>{abbreviationData.field}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500}>First Used:</Text>
          <Text>{abbreviationData.firstUsed}</Text>
        </Group>
        <Group gap="xs">
          <Text fw={500}>Pronunciation:</Text>
          <Text>{abbreviationData.pronunciation}</Text>
        </Group>
      </Stack>
    </Card>
  );

  const renderUsageExamples = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="usage-examples"
      ref={(el) => {
        sectionRefs.current['usage-examples'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Usage & Examples</Title>
        <Stack gap="xs">
          <Text fw={500}>Common Usage:</Text>
          <Text ml="md">{abbreviationData.usage}</Text>
        </Stack>
        <Stack gap="xs">
          <Text fw={500}>Examples:</Text>
          <Stack gap="xs" ml="md">
            {abbreviationData.examples.map((example, index) => (
              <Text key={index}>• {example}</Text>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderRelatedTerms = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="related-terms"
      ref={(el) => {
        sectionRefs.current['related-terms'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Related Terms</Title>
        <Text c="dimmed" mb="md">
          Terms and concepts commonly associated with this abbreviation
        </Text>
        <Group gap="xs">
          {abbreviationData.relatedTerms.map((term) => (
            <Badge key={term} variant="outline" color="red">
              {term}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );

  return (
    <Container fluid py="xl">
      <Stack gap="lg">
        {/* Header Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="xs">
            <Title order={2}>{abbreviationData.abbreviation}</Title>
            <Text size="lg" fw={500} c="dimmed">
              {abbreviationData.fullForm}
            </Text>
            <Badge color="red" variant="light">
              Abbreviation
            </Badge>
          </Stack>
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
              {renderOverview()}
              {renderClassification()}
              {renderUsageExamples()}
              {renderRelatedTerms()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
