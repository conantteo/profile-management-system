import {
  Avatar,
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
  IconBriefcase,
  IconHome,
  IconMail,
  IconMapPin,
  IconMoodSmile,
  IconTool,
  IconUser,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

interface PersonData {
  id: string;
  name: string;
  position: string;
  company: string;
  email: string;
  location: string;
  phone: string;
  department: string;
  joinDate: string;
  skills: string[];
  bio: string;
  professionalDetails: {
    experience: string;
    education: string;
    certifications: string[];
    previousRoles: Array<{
      title: string;
      company: string;
      duration: string;
    }>;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  funFacts: string[];
  personalBio: {
    hobbies: string[];
    interests: string[];
    favoriteQuote: string;
    personalityTraits: string[];
  };
}

export function PersonProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'professional-details'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);

  // Mock data - replace with actual API call
  const personData: PersonData = {
    id: id || '1',
    name: 'John Doe',
    position: 'Senior Software Engineer',
    company: 'Tech Corp',
    email: 'john.doe@techcorp.com',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    joinDate: 'January 2020',
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'AWS',
      'Docker',
      'GraphQL',
      'MongoDB',
    ],
    bio: 'Experienced software engineer with a passion for building scalable web applications and mentoring junior developers.',
    professionalDetails: {
      experience: '8+ years in software development',
      education: 'M.S. Computer Science, Stanford University',
      certifications: [
        'AWS Certified Solutions Architect',
        'Google Cloud Professional',
        'Scrum Master Certified',
      ],
      previousRoles: [
        {
          title: 'Software Engineer',
          company: 'StartupXYZ',
          duration: '2018-2020',
        },
        {
          title: 'Junior Developer',
          company: 'WebDev Inc',
          duration: '2016-2018',
        },
      ],
    },
    address: {
      street: '123 Tech Street, Apt 4B',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94105',
      country: 'United States',
    },
    funFacts: [
      'Has visited 25 countries',
      'Speaks 4 languages fluently',
      'Once debugged code while skydiving',
      'Maintains a popular tech blog with 50k+ followers',
      "Can solve a Rubik's cube in under 2 minutes",
      'Built his first computer at age 12',
      'Has a collection of 200+ vintage programming books',
      'Once gave a TED talk about sustainable coding practices',
      'Volunteers as a coding instructor for underprivileged youth',
      'Has contributed to over 50 open-source projects',
    ],
    personalBio: {
      hobbies: [
        'Photography',
        'Rock Climbing',
        'Cooking',
        'Gaming',
        'Woodworking',
        'Astronomy',
      ],
      interests: [
        'Artificial Intelligence',
        'Sustainable Technology',
        'Space Exploration',
        'Quantum Computing',
        'Renewable Energy',
      ],
      favoriteQuote:
        'The best way to predict the future is to invent it. - Alan Kay',
      personalityTraits: [
        'Analytical',
        'Creative',
        'Team Player',
        'Problem Solver',
        'Mentor',
        'Innovative',
      ],
    },
  };

  const sections = useMemo(() => [
    {
      id: 'professional-details',
      label: 'Professional Details',
      icon: IconBriefcase,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: IconTool,
    },
    {
      id: 'address',
      label: 'Address',
      icon: IconHome,
    },
    {
      id: 'fun-facts',
      label: 'Fun Facts',
      icon: IconMoodSmile,
    },
    {
      id: 'personal-bio',
      label: 'Personal Bio',
      icon: IconUser,
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
  }, [searchParams]);

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

  const renderProfessionalDetails = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="professional-details"
      ref={(el) => {
        sectionRefs.current['professional-details'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Professional Details</Title>

        <Group gap="xs">
          <Text fw={500}>Current Position:</Text>
          <Text>{personData.position}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Company:</Text>
          <Text>{personData.company}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Department:</Text>
          <Text>{personData.department}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Join Date:</Text>
          <Text>{personData.joinDate}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Experience:</Text>
          <Text>{personData.professionalDetails.experience}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Education:</Text>
          <Text>{personData.professionalDetails.education}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Certifications:</Text>
          <Stack gap="xs" ml="md">
            {personData.professionalDetails.certifications.map(
              (cert, index) => (
                <Text key={index}>• {cert}</Text>
              )
            )}
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Previous Roles:</Text>
          <Stack gap="md" ml="md">
            {personData.professionalDetails.previousRoles.map((role, index) => (
              <Box key={index}>
                <Text fw={500}>{role.title}</Text>
                <Text c="dimmed">
                  {role.company} • {role.duration}
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );

  const renderSkills = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="skills"
      ref={(el) => {
        if (el) sectionRefs.current['skills'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Skills & Technologies</Title>
        <Text c="dimmed" mb="md">
          A comprehensive overview of technical skills and expertise areas
          developed over years of professional experience.
        </Text>
        <Group gap="xs">
          {personData.skills.map((skill) => (
            <Badge key={skill} variant="outline" color="blue" size="lg">
              {skill}
            </Badge>
          ))}
        </Group>
        <Text mt="md" size="sm" c="dimmed">
          Continuously learning and adapting to new technologies and industry
          best practices.
        </Text>
      </Stack>
    </Card>
  );

  const renderAddress = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="address"
      ref={(el) => {
        if (el) sectionRefs.current['address'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Address & Contact Information</Title>

        <Stack gap="xs">
          <Text fw={500}>Street Address:</Text>
          <Text ml="md">{personData.address.street}</Text>
        </Stack>

        <Group gap="xs">
          <Text fw={500}>City:</Text>
          <Text>{personData.address.city}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>State:</Text>
          <Text>{personData.address.state}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>ZIP Code:</Text>
          <Text>{personData.address.zipCode}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Country:</Text>
          <Text>{personData.address.country}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500}>Contact Information:</Text>
          <Group gap="xs" ml="md">
            <IconMail size={16} />
            <Text>{personData.email}</Text>
          </Group>
          <Group gap="xs" ml="md">
            <IconMapPin size={16} />
            <Text>{personData.phone}</Text>
          </Group>
        </Stack>

        <Text mt="md" size="sm" c="dimmed">
          Available for professional inquiries and collaboration opportunities.
        </Text>
      </Stack>
    </Card>
  );

  const renderFunFacts = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="fun-facts"
      ref={(el) => {
        sectionRefs.current['fun-facts'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Fun Facts</Title>
        <Text c="dimmed" mb="md">
          Interesting tidbits and achievements that showcase personality and
          diverse interests beyond professional work.
        </Text>
        <Stack gap="sm">
          {personData.funFacts.map((fact, index) => (
            <Group key={index} gap="xs" align="flex-start">
              <Text c="blue" fw={500}>
                {index + 1}.
              </Text>
              <Text>{fact}</Text>
            </Group>
          ))}
        </Stack>
        <Text mt="md" size="sm" c="dimmed">
          Life is about more than just code - these experiences shape
          perspective and creativity in problem-solving.
        </Text>
      </Stack>
    </Card>
  );

  const renderPersonalBio = () => (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="personal-bio"
      ref={(el) => {
        sectionRefs.current['personal-bio'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Title order={3}>Personal Bio</Title>
        <Text c="dimmed" mb="md">
          Personal interests, values, and characteristics that define who I am
          outside of work.
        </Text>

        <Stack gap="xs">
          <Text fw={500}>Hobbies:</Text>
          <Group gap="xs" ml="md">
            {personData.personalBio.hobbies.map((hobby) => (
              <Badge key={hobby} variant="light" color="green">
                {hobby}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Interests:</Text>
          <Group gap="xs" ml="md">
            {personData.personalBio.interests.map((interest) => (
              <Badge key={interest} variant="light" color="purple">
                {interest}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Personality Traits:</Text>
          <Group gap="xs" ml="md">
            {personData.personalBio.personalityTraits.map((trait) => (
              <Badge key={trait} variant="light" color="orange">
                {trait}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text fw={500}>Favorite Quote:</Text>
          <Text ml="md" fs="italic" c="dimmed" size="lg">
            "{personData.personalBio.favoriteQuote}"
          </Text>
        </Stack>

        <Text mt="md" size="sm" c="dimmed">
          Believing in continuous growth, meaningful connections, and making a
          positive impact through technology.
        </Text>
      </Stack>
    </Card>
  );

  return (
    <Container fluid py="xl">
      <Stack gap="lg">
        {/* Header Card */}
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Group>
            <Avatar size={80} radius="md" color="blue">
              {personData.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
            <Stack gap="xs">
              <Title order={2}>{personData.name}</Title>
              <Text size="lg" fw={500} c="dimmed">
                {personData.position}
              </Text>
              <Badge color="blue" variant="light">
                Person
              </Badge>
            </Stack>
          </Group>
          <Text mt="md">{personData.bio}</Text>
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
              {renderProfessionalDetails()}
              {renderSkills()}
              {renderAddress()}
              {renderFunFacts()}
              {renderPersonalBio()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
