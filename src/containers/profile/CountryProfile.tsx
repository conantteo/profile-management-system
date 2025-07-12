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
  IconCoin,
  IconFlag,
  IconInfoCircle,
  IconMapPin,
  IconUsers,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

interface CountryData {
  id: string;
  name: string;
  capital: string;
  continent: string;
  population: number;
  area: number;
  currency: string;
  languages: string[];
  flag: string;
  description: string;
  geography: {
    borders: string[];
    coastline: string;
    climate: string;
    terrain: string;
    naturalResources: string[];
  };
  demographics: {
    populationGrowthRate: string;
    lifeExpectancy: string;
    literacyRate: string;
    majorCities: string[];
    ethnicGroups: string[];
  };
  economy: {
    gdp: string;
    gdpPerCapita: string;
    majorIndustries: string[];
    exports: string[];
    imports: string[];
  };
  culture: {
    religion: string[];
    nationalHolidays: string[];
    famousLandmarks: string[];
    cuisine: string[];
    traditions: string[];
  };
  funFacts: string[];
}

export function CountryProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'basic-info'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);

  // Mock data - replace with actual API call
  const countryData: CountryData = {
    id: id || '1',
    name: 'Japan',
    capital: 'Tokyo',
    continent: 'Asia',
    population: 125800000,
    area: 377975,
    currency: 'Japanese Yen (JPY)',
    languages: ['Japanese'],
    flag: '🇯🇵',
    description:
      'An island nation in East Asia known for its rich culture, advanced technology, and unique blend of traditional and modern society.',
    geography: {
      borders: ['None (Island nation)'],
      coastline: '29,751 km',
      climate: 'Temperate to subtropical',
      terrain: 'Mountainous islands with coastal plains',
      naturalResources: ['Fish', 'Negligible mineral resources', 'Forests'],
    },
    demographics: {
      populationGrowthRate: '-0.3%',
      lifeExpectancy: '84.6 years',
      literacyRate: '99%',
      majorCities: ['Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo'],
      ethnicGroups: [
        'Japanese 97.9%',
        'Chinese 0.6%',
        'Korean 0.4%',
        'Other 1.1%',
      ],
    },
    economy: {
      gdp: '$4.94 trillion',
      gdpPerCapita: '$39,285',
      majorIndustries: [
        'Automotive',
        'Electronics',
        'Machinery',
        'Steel',
        'Chemicals',
      ],
      exports: [
        'Motor vehicles',
        'Machinery',
        'Electronics',
        'Chemicals',
        'Steel',
      ],
      imports: [
        'Petroleum',
        'Liquid natural gas',
        'Clothing',
        'Semiconductors',
        'Coal',
      ],
    },
    culture: {
      religion: ['Shintoism', 'Buddhism', 'Christianity'],
      nationalHolidays: [
        "New Year's Day",
        'Golden Week',
        'Obon Festival',
        'Culture Day',
      ],
      famousLandmarks: [
        'Mount Fuji',
        'Tokyo Tower',
        'Fushimi Inari Shrine',
        'Hiroshima Peace Memorial',
      ],
      cuisine: ['Sushi', 'Ramen', 'Tempura', 'Soba', 'Udon', 'Yakitori'],
      traditions: [
        'Tea Ceremony',
        'Origami',
        'Martial Arts',
        'Cherry Blossom Viewing',
        'Calligraphy',
      ],
    },
    funFacts: [
      'Has over 6,800 islands, but only 430 are inhabited',
      "Home to the world's oldest continuous monarchy",
      'Invented karaoke, instant noodles, and the QR code',
      'Has more vending machines per capita than any other country',
      'The bullet train can reach speeds of up to 320 km/h',
      'Cherry blossom season attracts millions of tourists annually',
      'Has 21 UNESCO World Heritage Sites',
      "The world's third-largest economy",
      'Known for having some of the longest-living people in the world',
      'Anime and manga are major cultural exports',
    ],
  };

  const sections = useMemo(() => [
    {
      id: 'basic-info',
      label: 'Basic Information',
      icon: IconInfoCircle,
    },
    {
      id: 'geography',
      label: 'Geography',
      icon: IconMapPin,
    },
    {
      id: 'demographics',
      label: 'Demographics',
      icon: IconUsers,
    },
    {
      id: 'economy',
      label: 'Economy',
      icon: IconCoin,
    },
    {
      id: 'culture',
      label: 'Culture',
      icon: IconFlag,
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
          <Text fw={500}>Country:</Text>
          <Text>
            {countryData.name} {countryData.flag}
          </Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Capital:</Text>
          <Text>{countryData.capital}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Continent:</Text>
          <Text>{countryData.continent}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Population:</Text>
          <Text>{countryData.population.toLocaleString()}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Area:</Text>
          <Text>{countryData.area.toLocaleString()} km²</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Currency:</Text>
          <Text>{countryData.currency}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Languages:</Text>
          <Group gap="xs" ml="md">
            {countryData.languages.map((language) => (
              <Badge key={language} variant="outline" color="purple">
                {language}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Description:</Text>
          <Text ml="md">{countryData.description}</Text>
        </Stack>
      </Stack>
    </Card>
  );

  const renderGeography = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="geography"
      ref={(el: HTMLDivElement | null) => {
        if (el) sectionRefs.current['geography'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Geography</Title>

        <Group gap="xs">
          <Text fw={500}>Coastline:</Text>
          <Text>{countryData.geography.coastline}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Climate:</Text>
          <Text>{countryData.geography.climate}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Terrain:</Text>
          <Text>{countryData.geography.terrain}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Borders:</Text>
          <Stack gap="xs" ml="md">
            {countryData.geography.borders.map((border, index) => (
              <Text key={index}>• {border}</Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Natural Resources:</Text>
          <Group gap="xs" ml="md">
            {countryData.geography.naturalResources.map((resource) => (
              <Badge key={resource} variant="light" color="green">
                {resource}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );

  const renderDemographics = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="demographics"
      ref={(el) => {
        sectionRefs.current['demographics'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Demographics</Title>

        <Group gap="xs">
          <Text fw={500}>Population Growth Rate:</Text>
          <Text>{countryData.demographics.populationGrowthRate}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Life Expectancy:</Text>
          <Text>{countryData.demographics.lifeExpectancy}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Literacy Rate:</Text>
          <Text>{countryData.demographics.literacyRate}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Major Cities:</Text>
          <Group gap="xs" ml="md">
            {countryData.demographics.majorCities.map((city) => (
              <Badge key={city} variant="outline" color="blue">
                {city}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Ethnic Groups:</Text>
          <Stack gap="xs" ml="md">
            {countryData.demographics.ethnicGroups.map((group, index) => (
              <Text key={index}>• {group}</Text>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderEconomy = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="economy"
      ref={(el) => {
        sectionRefs.current['economy'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Economy</Title>

        <Group gap="xs">
          <Text fw={500}>GDP:</Text>
          <Text>{countryData.economy.gdp}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>GDP Per Capita:</Text>
          <Text>{countryData.economy.gdpPerCapita}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Major Industries:</Text>
          <Group gap="xs" ml="md">
            {countryData.economy.majorIndustries.map((industry) => (
              <Badge key={industry} variant="light" color="teal">
                {industry}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Major Exports:</Text>
          <Group gap="xs" ml="md">
            {countryData.economy.exports.map((export_item) => (
              <Badge key={export_item} variant="outline" color="green">
                {export_item}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Major Imports:</Text>
          <Group gap="xs" ml="md">
            {countryData.economy.imports.map((import_item) => (
              <Badge key={import_item} variant="outline" color="red">
                {import_item}
              </Badge>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Card>
  );

  const renderCulture = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="culture"
      ref={(el) => {
        sectionRefs.current['culture'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Culture & Traditions</Title>

        <Stack gap="xs">
          <Text fw={500}>Religion:</Text>
          <Group gap="xs" ml="md">
            {countryData.culture.religion.map((religion) => (
              <Badge key={religion} variant="light" color="violet">
                {religion}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>National Holidays:</Text>
          <Stack gap="xs" ml="md">
            {countryData.culture.nationalHolidays.map((holiday, index) => (
              <Text key={index}>• {holiday}</Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Famous Landmarks:</Text>
          <Stack gap="xs" ml="md">
            {countryData.culture.famousLandmarks.map((landmark, index) => (
              <Text key={index}>• {landmark}</Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Traditional Cuisine:</Text>
          <Group gap="xs" ml="md">
            {countryData.culture.cuisine.map((dish) => (
              <Badge key={dish} variant="light" color="orange">
                {dish}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Cultural Traditions:</Text>
          <Group gap="xs" ml="md">
            {countryData.culture.traditions.map((tradition) => (
              <Badge key={tradition} variant="outline" color="pink">
                {tradition}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Fun Facts:</Text>
          <Stack gap="sm" ml="md">
            {countryData.funFacts.map((fact, index) => (
              <Group key={index} gap="xs" align="flex-start">
                <Text c="purple" fw={500}>
                  {index + 1}.
                </Text>
                <Text>{fact}</Text>
              </Group>
            ))}
          </Stack>
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
            <Title order={2}>
              {countryData.name} {countryData.flag}
            </Title>
            <Text size="lg" fw={500} c="dimmed">
              Capital: {countryData.capital}
            </Text>
            <Badge color="purple" variant="light">
              Country
            </Badge>
          </Stack>
          <Text mt="md">{countryData.description}</Text>
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
              {renderGeography()}
              {renderDemographics()}
              {renderEconomy()}
              {renderCulture()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
