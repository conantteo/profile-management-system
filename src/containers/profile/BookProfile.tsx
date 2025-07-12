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
  IconBook,
  IconInfoCircle,
  IconQuote,
  IconStar,
  IconUser,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

interface BookData {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedDate: string;
  publisher: string;
  pages: number;
  language: string;
  genre: string[];
  description: string;
  authorInfo: {
    biography: string;
    nationality: string;
    birthYear: string;
    otherWorks: string[];
  };
  bookDetails: {
    format: string;
    dimensions: string;
    weight: string;
    edition: string;
    series: string;
  };
  reviews: {
    averageRating: number;
    totalReviews: number;
    criticalReception: string[];
    awards: string[];
  };
  quotes: string[];
}

export function BookProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'basic-info'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);

  // Mock data - replace with actual API call
  const bookData: BookData = {
    id: id || '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    publishedDate: 'April 10, 1925',
    publisher: "Charles Scribner's Sons",
    pages: 180,
    language: 'English',
    genre: ['Fiction', 'Classic Literature', 'American Literature'],
    description:
      'A classic American novel set in the Jazz Age, exploring themes of wealth, love, idealism, and moral decay in the American Dream.',
    authorInfo: {
      biography:
        'Francis Scott Key Fitzgerald was an American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.',
      nationality: 'American',
      birthYear: '1896',
      otherWorks: [
        'This Side of Paradise',
        'The Beautiful and Damned',
        'Tender Is the Night',
        'The Diamond as Big as the Ritz',
      ],
    },
    bookDetails: {
      format: 'Hardcover',
      dimensions: '8.5 x 5.5 x 1.2 inches',
      weight: '0.8 lbs',
      edition: 'First Edition',
      series: 'N/A',
    },
    reviews: {
      averageRating: 4.2,
      totalReviews: 2847,
      criticalReception: [
        'Considered one of the greatest American novels',
        'Masterpiece of American literature',
        'Brilliant portrayal of the Jazz Age',
        'Timeless exploration of the American Dream',
      ],
      awards: [
        "Modern Library's Top 100 Novels",
        "Time Magazine's All-Time 100 Greatest Novels",
      ],
    },
    quotes: [
      'So we beat on, boats against the current, borne back ceaselessly into the past.',
      "I hope she'll be a fool -- that's the best thing a girl can be in this world, a beautiful little fool.",
      'And so with the sunshine and the great bursts of leaves growing on the trees, just as things grow in fast movies, I had that familiar conviction that life was beginning over again with the summer.',
      'Gatsby believed in the green light, the orgastic future that year by year recedes before us.',
      'I was within and without, simultaneously enchanted and repelled by the inexhaustible variety of life.',
      'Let us learn to show our friendship for a man when he is alive and not after he is dead.',
      "The loneliest moment in someone's life is when they are watching their whole world fall apart.",
      "I like large parties. They're so intimate. At small parties there isn't any privacy.",
    ],
  };

  const sections = useMemo(() => [
    {
      id: 'basic-info',
      label: 'Basic Information',
      icon: IconInfoCircle,
    },
    {
      id: 'author-info',
      label: 'Author Information',
      icon: IconUser,
    },
    {
      id: 'book-details',
      label: 'Book Details',
      icon: IconBook,
    },
    {
      id: 'reviews',
      label: 'Reviews & Awards',
      icon: IconStar,
    },
    {
      id: 'quotes',
      label: 'Notable Quotes',
      icon: IconQuote,
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
          <Text fw={500}>Title:</Text>
          <Text>{bookData.title}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Author:</Text>
          <Text>{bookData.author}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>ISBN:</Text>
          <Text>{bookData.isbn}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Published:</Text>
          <Text>{bookData.publishedDate}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Publisher:</Text>
          <Text>{bookData.publisher}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Pages:</Text>
          <Text>{bookData.pages}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Language:</Text>
          <Text>{bookData.language}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Genre:</Text>
          <Group gap="xs" ml="md">
            {bookData.genre.map((genre) => (
              <Badge key={genre} variant="outline" color="orange">
                {genre}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Description:</Text>
          <Text ml="md">{bookData.description}</Text>
        </Stack>
      </Stack>
    </Card>
  );

  const renderAuthorInfo = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="author-info"
      ref={(el) => {
        sectionRefs.current['author-info'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Author Information</Title>

        <Group gap="xs">
          <Text fw={500}>Name:</Text>
          <Text>{bookData.author}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Nationality:</Text>
          <Text>{bookData.authorInfo.nationality}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Birth Year:</Text>
          <Text>{bookData.authorInfo.birthYear}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Biography:</Text>
          <Text ml="md">{bookData.authorInfo.biography}</Text>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Other Notable Works:</Text>
          <Stack gap="xs" ml="md">
            {bookData.authorInfo.otherWorks.map((work, index) => (
              <Text key={index}>• {work}</Text>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderBookDetails = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="book-details"
      ref={(el) => {
        sectionRefs.current['book-details'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Book Details</Title>
        <Text c="dimmed" mb="md">
          Physical and publication details about this edition.
        </Text>

        <Group gap="xs">
          <Text fw={500}>Format:</Text>
          <Text>{bookData.bookDetails.format}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Dimensions:</Text>
          <Text>{bookData.bookDetails.dimensions}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Weight:</Text>
          <Text>{bookData.bookDetails.weight}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Edition:</Text>
          <Text>{bookData.bookDetails.edition}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Series:</Text>
          <Text>{bookData.bookDetails.series}</Text>
        </Group>
      </Stack>
    </Card>
  );

  const renderReviews = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="reviews"
      ref={(el) => {
        sectionRefs.current['reviews'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Reviews & Awards</Title>

        <Group gap="xs">
          <Text fw={500}>Average Rating:</Text>
          <Text>{bookData.reviews.averageRating}/5.0</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Total Reviews:</Text>
          <Text>{bookData.reviews.totalReviews.toLocaleString()}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Critical Reception:</Text>
          <Stack gap="xs" ml="md">
            {bookData.reviews.criticalReception.map((review, index) => (
              <Text key={index}>• {review}</Text>
            ))}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Awards & Recognition:</Text>
          <Stack gap="xs" ml="md">
            {bookData.reviews.awards.map((award, index) => (
              <Text key={index}>• {award}</Text>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderQuotes = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="quotes"
      ref={(el) => {
        sectionRefs.current['quotes'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Notable Quotes</Title>
        <Text c="dimmed" mb="md">
          Memorable passages and quotes from the book.
        </Text>
        <Stack gap="lg">
          {bookData.quotes.map((quote, index) => (
            <Box
              key={index}
              p="md"
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: '4px solid #228be6',
              }}
            >
              <Text fs="italic" size="lg">
                "{quote}"
              </Text>
            </Box>
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
            <Title order={2}>{bookData.title}</Title>
            <Text size="lg" fw={500} c="dimmed">
              by {bookData.author}
            </Text>
            <Badge color="orange" variant="light">
              Book
            </Badge>
          </Stack>
          <Text mt="md">{bookData.description}</Text>
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
              {renderAuthorInfo()}
              {renderBookDetails()}
              {renderReviews()}
              {renderQuotes()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
