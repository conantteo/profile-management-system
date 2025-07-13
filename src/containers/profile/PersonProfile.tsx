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
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import {
  IconBriefcase,
  IconDotsVertical,
  IconEdit,
  IconHome,
  IconInfoCircle,
  IconMail,
  IconMapPin,
  IconMinus,
  IconMoodSmile,
  IconPlus,
  IconRefresh,
  IconTool,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

interface LinkageData {
  id: string;
  fromProfile: {
    profileId: string;
    profileType: 'person' | 'map' | 'book' | 'country' | 'abbreviations';
    profileName: string;
  };
  toProfile: {
    profileId: string;
    profileType: 'person' | 'map' | 'book' | 'country' | 'abbreviations';
    profileName: string;
  };
  linkageType: string;
  remarks: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

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
  professionalDetails: Array<{
    id: string;
    type: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
    modifiedBy: string;
    modifiedAt: string;
  }>;
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
  linkages: LinkageData[];
}

export function PersonProfile() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState(
    searchParams.get('section') || 'professional-details'
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

  // Professional details state
  const [professionalDetailModalOpen, setProfessionalDetailModalOpen] =
    useState(false);
  const [editingProfessionalDetail, setEditingProfessionalDetail] = useState<
    PersonData['professionalDetails'][0] | null
  >(null);
  const [professionalDetailForm, setProfessionalDetailForm] = useState({
    type: '',
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    description: '',
  });
  const [isCreateProfessionalMode, setIsCreateProfessionalMode] =
    useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(
    new Set()
  );
  // Linkages state
  const [linkageModalOpen, setLinkageModalOpen] = useState(false);
  const [editingLinkage, setEditingLinkage] = useState<LinkageData | null>(
    null
  );
  const [linkageForm, setLinkageForm] = useState({
    fromProfile: {
      profileId: '',
      profileType: '' as LinkageData['fromProfile']['profileType'] | '',
      profileName: '',
    },
    toProfile: {
      profileId: '',
      profileType: '' as LinkageData['toProfile']['profileType'] | '',
      profileName: '',
    },
    linkageType: '',
    remarks: '',
  });

  const [isCreateLinkageMode, setIsCreateLinkageMode] = useState(false);

  // Initialize the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setLinkageForm((prev) => ({
        ...prev,
        remarks: html,
      }));
    },
  });

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
    professionalDetails: [
      {
        id: '1',
        type: 'Work Experience',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2020-01-15',
        endDate: 'Present',
        description:
          'Lead development of scalable web applications and mentor junior developers.',
        modifiedBy: 'HR Manager',
        modifiedAt: '2024-01-15T10:30:00Z',
      },
      {
        id: '2',
        type: 'Work Experience',
        title: 'Software Engineer',
        company: 'StartupXYZ',
        startDate: '2018-03-01',
        endDate: '2019-12-31',
        description:
          'Developed full-stack applications using React and Node.js.',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-10T14:20:00Z',
      },
      {
        id: '3',
        type: 'Education',
        title: 'M.S. Computer Science',
        company: 'Stanford University',
        startDate: '2014-09-01',
        endDate: '2016-06-30',
        description: 'Specialized in distributed systems and machine learning.',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-08T09:15:00Z',
      },
      {
        id: '4',
        type: 'Certification',
        title: 'AWS Certified Solutions Architect',
        company: 'Amazon Web Services',
        startDate: '2021-05-15',
        endDate: '2024-05-15',
        description: 'Professional level certification for cloud architecture.',
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-05T16:45:00Z',
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
        id: '1',
        fromProfile: {
          profileId: 'person-001',
          profileType: 'person',
          profileName: 'John Doe',
        },
        toProfile: {
          profileId: 'person-123',
          profileType: 'person',
          profileName: 'Jane Smith',
        },
        linkageType: 'Colleague',
        remarks:
          '<p>Worked together on the <strong>cloud migration project</strong>. Jane provided valuable insights on:</p><ul><li>System architecture</li><li>Database optimization</li><li>Security best practices</li></ul><p><em>Highly recommended for future collaborations.</em></p>',
        createdBy: 'John Doe',
        createdAt: '2024-01-15T10:30:00Z',
        modifiedBy: 'HR Manager',
        modifiedAt: '2024-01-20T14:15:00Z',
      },
      {
        id: '2',
        fromProfile: {
          profileId: 'person-001',
          profileType: 'person',
          profileName: 'John Doe',
        },
        toProfile: {
          profileId: 'book-456',
          profileType: 'book',
          profileName: 'Clean Code by Robert Martin',
        },
        linkageType: 'Recommended Reading',
        remarks:
          '<p><strong>Highly influential book</strong> that shaped my coding practices.</p><p>Key takeaways:</p><ol><li>Write <em>meaningful</em> variable names</li><li>Keep functions small and focused</li><li>Use consistent formatting</li></ol><p>Referenced frequently in <mark>code reviews</mark> and team discussions.</p>',
        createdBy: 'Tech Lead',
        createdAt: '2024-01-10T09:00:00Z',
        modifiedBy: 'John Doe',
        modifiedAt: '2024-01-18T16:30:00Z',
      },
      {
        id: '3',
        fromProfile: {
          profileId: 'person-001',
          profileType: 'person',
          profileName: 'John Doe',
        },
        toProfile: {
          profileId: 'country-789',
          profileType: 'country',
          profileName: 'Germany',
        },
        linkageType: 'Work Location',
        remarks:
          '<p>Spent <strong>6 months</strong> working at our Berlin office.</p><p>Gained experience with:</p><ul><li>European data privacy regulations (<em>GDPR</em>)</li><li>International team collaboration</li><li>German business culture</li></ul><p>Would love to return for future projects! 🇩🇪</p>',
        createdBy: 'Admin',
        createdAt: '2024-01-05T11:45:00Z',
        modifiedBy: 'Admin',
        modifiedAt: '2024-01-05T11:45:00Z',
      },
    ],
  };

  const sections = useMemo(
    () => [
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

  // Professional details handlers
  const handleEditProfessionalDetail = (
    detail: PersonData['professionalDetails'][0]
  ) => {
    setEditingProfessionalDetail(detail);
    setProfessionalDetailForm({
      type: detail.type,
      title: detail.title,
      company: detail.company,
      startDate: detail.startDate,
      endDate: detail.endDate,
      description: detail.description,
    });
    setIsCreateProfessionalMode(false);
    setProfessionalDetailModalOpen(true);
  };

  const handleCreateProfessionalDetail = () => {
    setEditingProfessionalDetail(null);
    setProfessionalDetailForm({
      type: '',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsCreateProfessionalMode(true);
    setProfessionalDetailModalOpen(true);
  };

  const handleSaveProfessionalDetail = () => {
    if (isCreateProfessionalMode) {
      console.log('Creating new professional detail:', professionalDetailForm);
    } else if (editingProfessionalDetail) {
      console.log(
        `Saving edit for professional detail ${editingProfessionalDetail.id}:`,
        professionalDetailForm
      );
    }

    setProfessionalDetailModalOpen(false);
    setEditingProfessionalDetail(null);
    setProfessionalDetailForm({
      type: '',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsCreateProfessionalMode(false);
  };

  const handleCancelProfessionalDetail = () => {
    setProfessionalDetailModalOpen(false);
    setEditingProfessionalDetail(null);
    setProfessionalDetailForm({
      type: '',
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setIsCreateProfessionalMode(false);
  };

  const toggleDetailExpansion = (detailId: string) => {
    setExpandedDetails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(detailId)) {
        newSet.delete(detailId);
      } else {
        newSet.add(detailId);
      }
      return newSet;
    });
  };

  // Linkage handlers
  const handleEditLinkage = (linkage: LinkageData) => {
    setEditingLinkage(linkage);
    setLinkageForm({
      fromProfile: {
        profileId: linkage.fromProfile.profileId,
        profileType: linkage.fromProfile.profileType,
        profileName: linkage.fromProfile.profileName,
      },
      toProfile: {
        profileId: linkage.toProfile.profileId,
        profileType: linkage.toProfile.profileType,
        profileName: linkage.toProfile.profileName,
      },
      linkageType: linkage.linkageType,
      remarks: linkage.remarks,
    });

    // Set the editor content
    if (editor) {
      editor.commands.setContent(linkage.remarks);
    }

    setIsCreateLinkageMode(false);
    setLinkageModalOpen(true);
  };

  const handleCreateLinkage = () => {
    setEditingLinkage(null);
    setLinkageForm({
      fromProfile: {
        profileId: personData.id,
        profileType: 'person',
        profileName: personData.name,
      },
      toProfile: {
        profileId: '',
        profileType: '',
        profileName: '',
      },
      linkageType: '',
      remarks: '',
    });

    // Clear the editor content
    if (editor) {
      editor.commands.setContent('');
    }

    setIsCreateLinkageMode(true);
    setLinkageModalOpen(true);
  };

  const handleCancelLinkage = () => {
    setLinkageModalOpen(false);
    setEditingLinkage(null);
    setLinkageForm({
      fromProfile: {
        profileId: '',
        profileType: '',
        profileName: '',
      },
      toProfile: {
        profileId: '',
        profileType: '',
        profileName: '',
      },
      linkageType: '',
      remarks: '',
    });

    // Clear the editor content
    if (editor) {
      editor.commands.setContent('');
    }

    setIsCreateLinkageMode(false);
  };

  const handleSaveLinkage = () => {
    if (isCreateLinkageMode) {
      console.log('Creating new linkage:', linkageForm);
    } else if (editingLinkage) {
      console.log(`Saving edit for linkage ${editingLinkage.id}:`, linkageForm);
    }

    setLinkageModalOpen(false);
    setEditingLinkage(null);
    setLinkageForm({
      fromProfile: {
        profileId: '',
        profileType: '',
        profileName: '',
      },
      toProfile: {
        profileId: '',
        profileType: '',
        profileName: '',
      },
      linkageType: '',
      remarks: '',
    });
    setIsCreateLinkageMode(false);
  };

  const getProfileTypeColor = (
    type:
      | LinkageData['fromProfile']['profileType']
      | LinkageData['toProfile']['profileType']
  ) => {
    const colors = {
      person: 'blue',
      map: 'green',
      book: 'orange',
      country: 'red',
      abbreviations: 'purple',
    };
    return colors[type] || 'gray';
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
        <Group justify="space-between">
          <Title order={3}>Professional Details</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            variant="outline"
            size="sm"
            onClick={handleCreateProfessionalDetail}
          >
            Add Professional Detail
          </Button>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Current Position:
          </Text>
          <Text>{personData.position}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Company:
          </Text>
          <Text>{personData.company}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Department:
          </Text>
          <Text>{personData.department}</Text>
        </Group>

        <Group gap="xs">
          <Text fw={500} style={{ minWidth: '60px' }}>
            Join Date:
          </Text>
          <Text>{personData.joinDate}</Text>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Type</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Company/Institution</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>Modified By</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {personData.professionalDetails.map((detail) => (
              <>
                <Table.Tr key={detail.id}>
                  <Table.Td>
                    <Badge color="blue" variant="light">
                      {detail.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500} style={{ minWidth: '60px' }}>
                      {detail.title}
                    </Text>
                  </Table.Td>
                  <Table.Td>{detail.company}</Table.Td>
                  <Table.Td>
                    {new Date(detail.startDate).toLocaleDateString()}
                  </Table.Td>
                  <Table.Td>
                    {detail.endDate === 'Present' ? (
                      <Badge color="green" variant="light">
                        Present
                      </Badge>
                    ) : (
                      new Date(detail.endDate).toLocaleDateString()
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {detail.modifiedBy}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => toggleDetailExpansion(detail.id)}
                        aria-label={
                          expandedDetails.has(detail.id)
                            ? 'Collapse description'
                            : 'Expand description'
                        }
                      >
                        {expandedDetails.has(detail.id) ? (
                          <IconMinus size="1rem" />
                        ) : (
                          <IconPlus size="1rem" />
                        )}
                      </ActionIcon>
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size="1rem" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={
                              <IconInfoCircle size="1rem" color="gray" />
                            }
                            disabled
                          >
                            {`Modified by ${detail.modifiedBy} on ${new Date(detail.modifiedAt).toLocaleDateString()}`}
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size="1rem" color="blue" />}
                            onClick={() => handleEditProfessionalDetail(detail)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconTrash size="1rem" color="red" />}
                            onClick={() => console.log('Delete', detail.id)}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
                {expandedDetails.has(detail.id) && (
                  <Table.Tr key={`${detail.id}-description`}>
                    <Table.Td colSpan={7}>
                      <Box p="sm" bg="gray.0">
                        <Text size="sm">{detail.description}</Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            ))}
          </Table.Tbody>
        </Table>
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
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="linkages"
      ref={(el) => {
        sectionRefs.current['linkages'] = el;
      }}
      mb="xl"
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Linkages</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            variant="outline"
            size="sm"
            onClick={handleCreateLinkage}
          >
            Add Linkage
          </Button>
        </Group>

        <Text c="dimmed" mb="md">
          Connections to other profiles, resources, and entities that provide
          context and relationships.
        </Text>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>From Profile</Table.Th>
              <Table.Th>To Profile</Table.Th>
              <Table.Th>Linkage Type</Table.Th>
              <Table.Th>Created By</Table.Th>
              <Table.Th>Modified By</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {personData.linkages.map((linkage) => (
              <>
                <Table.Tr key={linkage.id}>
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Badge
                          color={getProfileTypeColor(
                            linkage.fromProfile.profileType
                          )}
                          variant="light"
                          size="sm"
                        >
                          {linkage.fromProfile.profileType}
                        </Badge>
                        <Text fw={500} size="sm">
                          {linkage.fromProfile.profileName}
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        c="dimmed"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {linkage.fromProfile.profileId}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>
                    <Stack gap="xs">
                      <Group gap="xs">
                        <Badge
                          color={getProfileTypeColor(
                            linkage.toProfile.profileType
                          )}
                          variant="light"
                          size="sm"
                        >
                          {linkage.toProfile.profileType}
                        </Badge>
                        <Text fw={500} size="sm">
                          {linkage.toProfile.profileName}
                        </Text>
                      </Group>
                      <Text
                        size="xs"
                        c="dimmed"
                        style={{ fontFamily: 'monospace' }}
                      >
                        {linkage.toProfile.profileId}
                      </Text>
                    </Stack>
                  </Table.Td>
                  <Table.Td>{linkage.linkageType}</Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {linkage.createdBy}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {linkage.modifiedBy}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => toggleDetailExpansion(linkage.id)}
                        aria-label={
                          expandedDetails.has(linkage.id)
                            ? 'Collapse remarks'
                            : 'Expand remarks'
                        }
                      >
                        {expandedDetails.has(linkage.id) ? (
                          <IconMinus size="1rem" />
                        ) : (
                          <IconPlus size="1rem" />
                        )}
                      </ActionIcon>
                      <Menu position="bottom-end" shadow="md">
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size="1rem" />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={
                              <IconInfoCircle size="1rem" color="gray" />
                            }
                            disabled
                          >
                            {`Created by ${linkage.createdBy} on ${new Date(linkage.createdAt).toLocaleDateString()}`}
                          </Menu.Item>
                          <Menu.Item
                            leftSection={
                              <IconInfoCircle size="1rem" color="gray" />
                            }
                            disabled
                          >
                            {`Modified by ${linkage.modifiedBy} on ${new Date(linkage.modifiedAt).toLocaleDateString()}`}
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size="1rem" color="blue" />}
                            onClick={() => handleEditLinkage(linkage)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconTrash size="1rem" color="red" />}
                            onClick={() => console.log('Delete', linkage.id)}
                            color="red"
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
                {expandedDetails.has(linkage.id) && (
                  <Table.Tr key={`${linkage.id}-remarks`}>
                    <Table.Td colSpan={6}>
                      <Box p="sm" bg="gray.0">
                        <Text size="sm" fw={500} mb="xs">
                          Remarks:
                        </Text>
                        <Box
                          style={{
                            fontSize: '14px',
                            lineHeight: 1.5,
                          }}
                          dangerouslySetInnerHTML={{ __html: linkage.remarks }}
                        />
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                )}
              </>
            ))}
          </Table.Tbody>
        </Table>

        <Text mt="md" size="sm" c="dimmed">
          These linkages help establish connections and provide context for
          professional and personal relationships.
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
              {renderProfessionalDetails()}
              {renderSkills()}
              {renderAddress()}
              {renderLinkages()}
              {renderFunFacts()}
              {renderPersonalBio()}
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

      {/* Edit/Create Professional Detail Modal */}
      <Modal
        opened={professionalDetailModalOpen}
        onClose={handleCancelProfessionalDetail}
        title={
          isCreateProfessionalMode
            ? 'Create Professional Detail'
            : 'Edit Professional Detail'
        }
        centered
        size="lg"
      >
        <Stack gap="md">
          <Select
            label="Type"
            placeholder="Select type..."
            value={professionalDetailForm.type}
            onChange={(value) =>
              setProfessionalDetailForm((prev) => ({
                ...prev,
                type: value || '',
              }))
            }
            data={[
              { value: 'Work Experience', label: 'Work Experience' },
              { value: 'Education', label: 'Education' },
              { value: 'Certification', label: 'Certification' },
              { value: 'Training', label: 'Training' },
              { value: 'Volunteer Work', label: 'Volunteer Work' },
            ]}
            required
          />

          <TextInput
            label="Title"
            placeholder="Enter title..."
            value={professionalDetailForm.title}
            onChange={(e) =>
              setProfessionalDetailForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            required
          />

          <TextInput
            label="Company/Institution"
            placeholder="Enter company or institution..."
            value={professionalDetailForm.company}
            onChange={(e) =>
              setProfessionalDetailForm((prev) => ({
                ...prev,
                company: e.target.value,
              }))
            }
            required
          />

          <Group grow>
            <TextInput
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={professionalDetailForm.startDate}
              onChange={(e) =>
                setProfessionalDetailForm((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              required
            />
            <TextInput
              label="End Date"
              placeholder="YYYY-MM-DD or 'Present'"
              value={professionalDetailForm.endDate}
              onChange={(e) =>
                setProfessionalDetailForm((prev) => ({
                  ...prev,
                  endDate: e.target.value,
                }))
              }
              required
            />
          </Group>

          <Textarea
            label="Description"
            placeholder="Enter description..."
            value={professionalDetailForm.description}
            onChange={(e) =>
              setProfessionalDetailForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            required
          />

          {editingProfessionalDetail && !isCreateProfessionalMode && (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                <strong>Last modified:</strong>{' '}
                {new Date(
                  editingProfessionalDetail.modifiedAt
                ).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Modified by:</strong>{' '}
                {editingProfessionalDetail.modifiedBy}
              </Text>
            </Stack>
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={handleCancelProfessionalDetail}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfessionalDetail}
              disabled={
                !professionalDetailForm.type ||
                !professionalDetailForm.title ||
                !professionalDetailForm.company
              }
            >
              {isCreateProfessionalMode ? 'Create' : 'Save Changes'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit/Create Linkage Modal */}
      {/* Edit/Create Linkage Modal */}
      <Modal
        opened={linkageModalOpen}
        onClose={handleCancelLinkage}
        title={isCreateLinkageMode ? 'Create Linkage' : 'Edit Linkage'}
        centered
        size="xl"
      >
        <Stack gap="md">
          <SimpleGrid cols={2} spacing="lg">
            {/* Left Column - From Profile */}
            <Stack gap="md">
              <Title order={4} c="blue">
                Link From Profile
              </Title>

              <Select
                label="Profile Type"
                placeholder="Select profile type..."
                value={linkageForm.fromProfile.profileType}
                onChange={(value) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    fromProfile: {
                      ...prev.fromProfile,
                      profileType:
                        (value as LinkageData['fromProfile']['profileType']) ||
                        '',
                    },
                  }))
                }
                data={[
                  { value: 'person', label: 'Person' },
                  { value: 'map', label: 'Map' },
                  { value: 'book', label: 'Book' },
                  { value: 'country', label: 'Country' },
                  { value: 'abbreviations', label: 'Abbreviations' },
                ]}
                required
              />

              <TextInput
                label="Profile ID"
                placeholder="Enter profile ID..."
                value={linkageForm.fromProfile.profileId}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    fromProfile: {
                      ...prev.fromProfile,
                      profileId: e.target.value,
                    },
                  }))
                }
                required
              />

              <TextInput
                label="Profile Name"
                placeholder="Enter profile name..."
                value={linkageForm.fromProfile.profileName}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    fromProfile: {
                      ...prev.fromProfile,
                      profileName: e.target.value,
                    },
                  }))
                }
                required
              />
            </Stack>

            {/* Right Column - To Profile */}
            <Stack gap="md">
              <Title order={4} c="green">
                Link To Profile
              </Title>

              <Select
                label="Profile Type"
                placeholder="Select profile type..."
                value={linkageForm.toProfile.profileType}
                onChange={(value) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    toProfile: {
                      ...prev.toProfile,
                      profileType:
                        (value as LinkageData['toProfile']['profileType']) ||
                        '',
                    },
                  }))
                }
                data={[
                  { value: 'person', label: 'Person' },
                  { value: 'map', label: 'Map' },
                  { value: 'book', label: 'Book' },
                  { value: 'country', label: 'Country' },
                  { value: 'abbreviations', label: 'Abbreviations' },
                ]}
                required
              />

              <TextInput
                label="Profile ID"
                placeholder="Enter profile ID..."
                value={linkageForm.toProfile.profileId}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    toProfile: {
                      ...prev.toProfile,
                      profileId: e.target.value,
                    },
                  }))
                }
                required
              />

              <TextInput
                label="Profile Name"
                placeholder="Enter profile name..."
                value={linkageForm.toProfile.profileName}
                onChange={(e) =>
                  setLinkageForm((prev) => ({
                    ...prev,
                    toProfile: {
                      ...prev.toProfile,
                      profileName: e.target.value,
                    },
                  }))
                }
                required
              />
            </Stack>
          </SimpleGrid>

          {/* Linkage Details - Full Width */}
          <Stack gap="md">
            <Title order={4} c="orange">
              Linkage Details
            </Title>

            <TextInput
              label="Linkage Type"
              placeholder="Enter linkage type (e.g., Colleague, Reference, etc.)..."
              value={linkageForm.linkageType}
              onChange={(e) =>
                setLinkageForm((prev) => ({
                  ...prev,
                  linkageType: e.target.value,
                }))
              }
              required
            />

            {/* Rich Text Editor for Remarks */}
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Remarks{' '}
                <Text component="span" c="red">
                  *
                </Text>
              </Text>
              <RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                    <RichTextEditor.Subscript />
                    <RichTextEditor.Superscript />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                  </RichTextEditor.ControlsGroup>

                  <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                  </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content style={{ minHeight: '200px' }} />
              </RichTextEditor>
              <Text size="xs" c="dimmed">
                Use the rich text editor to format your remarks with bold,
                italic, lists, links, and more.
              </Text>
            </Stack>
          </Stack>

          {editingLinkage && !isCreateLinkageMode && (
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                <strong>Created:</strong>{' '}
                {new Date(editingLinkage.createdAt).toLocaleDateString()} by{' '}
                {editingLinkage.createdBy}
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Last modified:</strong>{' '}
                {new Date(editingLinkage.modifiedAt).toLocaleDateString()} by{' '}
                {editingLinkage.modifiedBy}
              </Text>
            </Stack>
          )}

          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={handleCancelLinkage}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveLinkage}
              disabled={
                !linkageForm.fromProfile.profileType ||
                !linkageForm.fromProfile.profileId ||
                !linkageForm.fromProfile.profileName ||
                !linkageForm.toProfile.profileType ||
                !linkageForm.toProfile.profileId ||
                !linkageForm.toProfile.profileName ||
                !linkageForm.linkageType ||
                !linkageForm.remarks.trim()
              }
            >
              {isCreateLinkageMode ? 'Create' : 'Save Changes'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}
