import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Menu,
  Modal,
  NavLink,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBriefcase,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconHome,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconMoodSmile,
  IconPlus,
  IconRefresh,
  IconTool,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { AttachmentSegment } from '../../components/Segment/AttachmentSegment';
import { HistoricalRecordsSegment } from '../../components/Segment/HistoricalRecordsSegment';
import { LinkageSegment } from '../../components/Segment/LinkageSegment';
import type { HistoricalRecord } from '../../types/historicalRecord';
import type { Linkage } from '../../types/linkage';

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
  historicalRecords: Array<HistoricalRecord>;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  funFacts: Array<{
    id: string;
    text: string;
    modifiedBy: string;
    modifiedAt: string;
  }>;
  personalBio: {
    name: string;
    alias: string;
    gender: string;
    country: string;
    address: string;
  } | null;
  linkages: Linkage[];
}

export function PersonProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'historical-records'
  );
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isScrollingToSection = useRef(false);
  const [personalBioError, setPersonalBioError] = useState(true); // Initially show error state
  const [isRefetching, setIsRefetching] = useState(false);
  const [personalBioData, setPersonalBioData] =
    useState<PersonData['personalBio']>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFact, setEditingFact] = useState<
    PersonData['funFacts'][0] | null
  >(null);
  const [editText, setEditText] = useState('');
  const [isCreateMode, setIsCreateMode] = useState(false);

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
    historicalRecords: [
      {
        id: '1',
        startDate: '15/01/2020',
        endDate: '',
        description:
          'Lead development of scalable web applications and mentor junior developers.',
        submissionNo: '1',
        status: 'PROCESSED',
      },
      {
        id: '2',
        startDate: '01/03/2016',
        endDate: '31/12/2019',
        description:
          'Developed full-stack applications using React and Node.js.',
        submissionNo: '2',
        status: 'PROCESSED',
      },
      {
        id: '3',
        startDate: '01/09/2014',
        endDate: '30/06/2016',
        description: 'Specialized in distributed systems and machine learning.',
        submissionNo: '3',
        status: 'PROCESSED',
      },
      {
        id: '4',
        startDate: '15/05/2021',
        endDate: '15/05/2024',
        description: 'Professional level certification for cloud architecture.',
        submissionNo: '4',
        status: 'PENDING',
      },
    ],
    address: {
      street: '123 Tech Street, Apt 4B',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94105',
      country: 'United States',
    },
    funFacts: [
      {
        id: '1',
        text: 'Has visited 25 countries',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        text: 'Speaks 4 languages fluently',
        modifiedBy: 'HR Manager',
        modifiedAt: '2024-01-10T14:20:00Z',
      },
      {
        id: '3',
        text: 'Once debugged code while skydiving',
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-08T09:15:00Z',
      },
      {
        id: '4',
        text: 'Maintains a popular tech blog with 50k+ followers',
        modifiedBy: 'Marketing Team',
        modifiedAt: '2024-01-05T16:45:00Z',
      },
      {
        id: '5',
        text: "Can solve a Rubik's cube in under 2 minutes",
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-03T11:00:00Z',
      },
      {
        id: '6',
        text: 'Built his first computer at age 12',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-01T08:30:00Z',
      },
      {
        id: '7',
        text: 'Has visited 25 countries',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '8',
        text: 'Speaks 4 languages fluently',
        modifiedBy: 'HR Manager',
        modifiedAt: '2024-01-10T14:20:00Z',
      },
      {
        id: '9',
        text: 'Once debugged code while skydiving',
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-08T09:15:00Z',
      },
      {
        id: '10',
        text: 'Maintains a popular tech blog with 50k+ followers',
        modifiedBy: 'Marketing Team',
        modifiedAt: '2024-01-05T16:45:00Z',
      },
      {
        id: '11',
        text: "Can solve a Rubik's cube in under 2 minutes",
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-03T11:00:00Z',
      },
      {
        id: '12',
        text: 'Built his first computer at age 12',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-01T08:30:00Z',
      },
      {
        id: '13',
        text: 'Has visited 25 countries',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '14',
        text: 'Speaks 4 languages fluently',
        modifiedBy: 'HR Manager',
        modifiedAt: '2024-01-10T14:20:00Z',
      },
      {
        id: '15',
        text: 'Once debugged code while skydiving',
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-08T09:15:00Z',
      },
      {
        id: '16',
        text: 'Maintains a popular tech blog with 50k+ followers',
        modifiedBy: 'Marketing Team',
        modifiedAt: '2024-01-05T16:45:00Z',
      },
      {
        id: '17',
        text: "Can solve a Rubik's cube in under 2 minutes",
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-03T11:00:00Z',
      },
      {
        id: '18',
        text: 'Built his first computer at age 12',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-01T08:30:00Z',
      },
    ],
    personalBio: personalBioData, // Use state data
    linkages: [
      {
        id: '1a2b3c',
        type: 'Partnership',
        details: [
          { key: 'agreementType', value: 'Exclusive' },
          { key: 'duration', value: '5 years' },
        ],
        remarks: 'Initial partnership agreement.',
        entity1Alias: 'Alpha Corp',
        entity2Alias: 'Beta LLC',
        startDate: '01/01/2023',
        endDate: '01/01/2028',
        createdDate: '15/12/2022',
        createdBy: 'adminUser',
        lastUpdatedDate: '10/02/2023',
        lastUpdatedBy: 'adminUser',
        entity1: {
          id: 'E1-001',
          idNumber: 'A12345',
          type: 'country',
          name: 'Alpha Country',
        },
        entity2: {
          id: 'E2-002',
          idNumber: 'B67890',
          type: 'book',
          name: 'Beta Book',
        },
      },
      {
        id: '4d5e6f',
        type: 'Supplier',
        details: [
          { key: 'region', value: 'APAC' },
          { key: 'contractValue', value: '500000 USD' },
        ],
        remarks: 'Supplier for hardware components.',
        entity1Alias: 'Gamma Inc',
        entity2Alias: 'Delta Supplies',
        startDate: '01/03/2024',
        endDate: '01/03/2025',
        createdDate: '20/02/2024',
        createdBy: 'supplierMgr',
        lastUpdatedDate: '25/02/2024',
        lastUpdatedBy: 'supplierMgr',
        entity1: {
          id: 'E1-010',
          idNumber: 'G54321',
          type: 'abbreviation',
          name: 'GMA',
        },
        entity2: {
          id: 'E2-020',
          idNumber: 'D09876',
          type: 'map',
          name: 'Delta Region Map',
        },
      },
      {
        id: '7g8h9i',
        type: 'Contract',
        details: [
          { key: 'contractType', value: 'Service' },
          { key: 'paymentTerms', value: 'Net 30' },
        ],
        remarks: 'Service contract for IT support.',
        entity1Alias: 'Omega Solutions',
        entity2Alias: 'Sigma Tech',
        startDate: '15/06/2022',
        endDate: '15/06/2023',
        createdDate: '20/05/2022',
        createdBy: 'contractAdmin',
        lastUpdatedDate: '01/12/2022',
        lastUpdatedBy: 'contractAdmin',
        entity1: {
          id: 'E1-100',
          idNumber: 'O98765',
          type: 'person',
          name: 'Omega Person',
        },
        entity2: {
          id: 'E2-200',
          idNumber: 'S43210',
          type: 'person',
          name: 'Sigma Person',
        },
      },
      {
        id: '0j1k2l',
        type: 'Collaboration',
        details: [
          { key: 'project', value: 'AI Development' },
          { key: 'funding', value: '2M USD' },
        ],
        remarks: 'Joint AI research project.',
        entity1Alias: 'Theta Labs',
        entity2Alias: 'Lambda AI',
        startDate: '01/01/2025',
        endDate: '31/12/2027',
        createdDate: '10/11/2024',
        createdBy: 'projectLead',
        lastUpdatedDate: '05/05/2025',
        lastUpdatedBy: 'projectLead',
        entity1: {
          id: 'E1-300',
          idNumber: 'T12378',
          type: 'book',
          name: 'Theta Encyclopedia',
        },
        entity2: {
          id: 'E2-400',
          idNumber: 'L87654',
          type: 'abbreviation',
          name: 'LAI',
        },
      },
      {
        id: '3m4n5o',
        type: 'Acquisition',
        details: [
          { key: 'purchasePrice', value: '150M USD' },
          { key: 'sharesTransferred', value: '100%' },
        ],
        remarks: 'Acquisition of Epsilon Ventures.',
        entity1Alias: 'Zeta Holdings',
        entity2Alias: 'Epsilon Ventures',
        startDate: '01/09/2021',
        endDate: '01/09/2022',
        createdDate: '15/07/2021',
        createdBy: 'ceoZeta',
        lastUpdatedDate: '30/08/2022',
        lastUpdatedBy: 'financeTeam',
        entity1: {
          id: 'E1-500',
          idNumber: 'Z45678',
          type: 'country',
          name: 'Zeta Country',
        },
        entity2: {
          id: 'E2-600',
          idNumber: 'E11223',
          type: 'map',
          name: 'Epsilon Region Map',
        },
      },
    ],
  };

  const sections = useMemo(
    () => [
      {
        id: 'historical-records',
        label: 'Historical Records',
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
        id: 'linkages',
        label: 'Linkages',
        icon: IconUser,
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
      {
        id: 'attachment',
        label: 'Attachments',
        icon: IconFolder,
      },
    ],
    []
  );

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

  const handleRefetchPersonalBio = async () => {
    setIsRefetching(true);
    setPersonalBioError(false);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, randomly succeed or fail
      const shouldFail = Math.random() > 0.3;
      if (shouldFail) {
        throw new Error('Failed to fetch personal bio data');
      }

      // Simulate successful data fetch
      setPersonalBioData({
        name: 'John Doe',
        alias: 'JD',
        gender: 'Male',
        country: 'United States',
        address: '123 Tech Street, Apt 4B, San Francisco, CA 94105',
      });

      setPersonalBioError(false);
    } catch (error) {
      console.error(error);
      setPersonalBioError(true);
    } finally {
      setIsRefetching(false);
    }
  };

  const handleEditFact = (fact: PersonData['funFacts'][0]) => {
    setEditingFact(fact);
    setEditText(fact.text);
    setIsCreateMode(false);
    setEditModalOpen(true);
  };

  const handleCreateFact = () => {
    setEditingFact(null);
    setEditText('');
    setIsCreateMode(true);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (isCreateMode) {
      // In a real app, you would make an API call here to create a new fact
      console.log(`Creating new fact: "${editText}"`);

      // For demo purposes, just log the action
      // You would add the new fact to the data here
    } else if (editingFact) {
      // In a real app, you would make an API call here to update the fact
      console.log(`Saving edit for fact ${editingFact.id}: "${editText}"`);

      // For demo purposes, just log the action
      // You would update the actual data here
    }

    setEditModalOpen(false);
    setEditingFact(null);
    setEditText('');
    setIsCreateMode(false);
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditingFact(null);
    setEditText('');
    setIsCreateMode(false);
  };

  const renderHistoricalRecords = () => (
    <HistoricalRecordsSegment
      ref={(el) => {
        sectionRefs.current['historical-records'] = el;
      }}
      historicalRecords={personData.historicalRecords}
    />
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
          <Text fw={500} style={{ minWidth: '60px' }}>
            Street Address:
          </Text>
          <Text ml="md">{personData.address.street}</Text>
        </Stack>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            City:
          </Text>
          <Text>{personData.address.city}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            State:
          </Text>
          <Text>{personData.address.state}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            ZIP Code:
          </Text>
          <Text>{personData.address.zipCode}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Country:
          </Text>
          <Text>{personData.address.country}</Text>
        </Group>

        <Stack gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Contact Information:
          </Text>
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
        <Group justify="space-between" align="center">
          <Title order={3}>Fun Facts</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={handleCreateFact}
            size="sm"
            variant="light"
          >
            Add Fun Fact
          </Button>
        </Group>
        <Text c="dimmed" mb="md">
          Interesting tidbits and achievements that showcase personality and
          diverse interests beyond professional work.
        </Text>

        <SimpleGrid cols={2} spacing="md">
          {personData.funFacts.map((fact, index) => (
            <Card key={fact.id} shadow="xs" padding="md" radius="md" withBorder>
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                  <Text c="blue" fw={500} size="sm">
                    #{index + 1}
                  </Text>
                  <Menu position="bottom-end" shadow="md" withinPortal>
                    <Menu.Target>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        radius="xl"
                      >
                        <IconDotsVertical size={14} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconInfoCircle size={14} color="gray" />}
                        disabled
                      >
                        {`Modified by ${fact.modifiedBy} on ${new Date(fact.modifiedAt).toLocaleDateString()}`}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} color="blue" />}
                        onClick={() => handleEditFact(fact)}
                      >
                        Edit
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconTrash size={14} color="red" />}
                        onClick={() => console.log(`Delete fact ${fact.id}`)}
                        color="red"
                      >
                        Delete
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>

                <Text size="sm" lineClamp={3}>
                  {fact.text}
                </Text>

                <Text size="xs" c="dimmed">
                  Modified by {fact.modifiedBy} •{' '}
                  {new Date(fact.modifiedAt).toLocaleDateString()}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>

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
          Personal information and biographical details.
        </Text>

        {personalBioError || !personData.personalBio ? (
          <Stack gap="md" align="center" py="xl">
            <Text size="lg" fw={500} c="red">
              Failed to fetch Personal Bio data
            </Text>
            <Button
              variant="outline"
              leftSection={<IconRefresh size={16} />}
              onClick={handleRefetchPersonalBio}
              loading={isRefetching}
            >
              Retry
            </Button>
          </Stack>
        ) : (
          <SimpleGrid cols={2} spacing="lg">
            <Stack gap="md">
              <Group gap="xs">
                <Text fw={500} style={{ minWidth: '60px' }}>
                  Name
                </Text>
                <Text>: {personData.personalBio.name}</Text>
              </Group>

              <Group gap="xs">
                <Text fw={500} style={{ minWidth: '60px' }}>
                  Alias
                </Text>
                <Text>: {personData.personalBio.alias}</Text>
              </Group>

              <Group gap="xs">
                <Text fw={500} style={{ minWidth: '60px' }}>
                  Gender
                </Text>
                <Text>: {personData.personalBio.gender}</Text>
              </Group>
            </Stack>

            <Stack gap="md">
              <Group gap="xs">
                <Text fw={500} style={{ minWidth: '60px' }}>
                  Country
                </Text>
                <Text>: {personData.personalBio.country}</Text>
              </Group>

              <Group gap="xs">
                <Text fw={500} style={{ minWidth: '60px' }}>
                  Address
                </Text>
                <Text>: {personData.personalBio.address}</Text>
              </Group>
            </Stack>
          </SimpleGrid>
        )}
      </Stack>
    </Card>
  );

  const renderLinkages = () => (
    <LinkageSegment
      ref={(el) => {
        sectionRefs.current['linkages'] = el;
      }}
      linkages={personData.linkages}
    />
  );

  const renderAttachments = () => (
    <AttachmentSegment
      ref={(el) => {
        sectionRefs.current['attachment'] = el;
      }}
    />
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
        <SimpleGrid cols={5} spacing="lg" style={{ alignItems: 'flex-start' }}>
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
          <Box style={{ gridColumn: 'span 4' }}>
            <Stack gap={0}>
              {renderHistoricalRecords()}
              {renderSkills()}
              {renderAddress()}
              {renderLinkages()}
              {renderFunFacts()}
              {renderPersonalBio()}
              {renderAttachments()}
            </Stack>
          </Box>
        </SimpleGrid>
      </Stack>

      {/* Edit/Create Fun Fact Modal */}
      <Modal
        opened={editModalOpen}
        onClose={handleCancelEdit}
        title={isCreateMode ? 'Create Fun Fact' : 'Edit Fun Fact'}
        centered
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Fun Fact"
            placeholder="Enter fun fact..."
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            data-autofocus
          />

          {editingFact && !isCreateMode && (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                <strong>Last modified:</strong>{' '}
                {new Date(editingFact.modifiedAt).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Modified by:</strong> {editingFact.modifiedBy}
              </Text>
            </Stack>
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editText.trim()}>
              {isCreateMode ? 'Create' : 'Save Changes'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
