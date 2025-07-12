import {
  Button,
  Card,
  Checkbox,
  Container,
  FileInput,
  Group,
  MultiSelect,
  NativeSelect,
  NumberInput,
  Radio,
  RangeSlider,
  Rating,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePickerInput, MonthPickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconCalendarStats, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';

export function CreateReportForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      reportType: '',
      authors: [],
      department: '',
      fiscalYear: null,
      publicationDate: null,
      confidentialityLevel: 'internal',
      keywords: [],
      status: 'draft',
      priority: 'medium',
      qualityRating: 3,
      budgetRange: [1000, 5000],
      includeExecutiveSummary: true,
      includeAppendices: false,
      includeGraphics: true,
      notes: '',
      attachments: null,
      reviewers: [],
    },
    validate: {
      title: (value) =>
        value.length < 3 ? 'Title must be at least 3 characters' : null,
      description: (value) =>
        value.length < 10 ? 'Description must be at least 10 characters' : null,
      reportType: (value) => (!value ? 'Report type is required' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    // Simulate API call
    console.log('Submitting report data:', values);
    setTimeout(() => {
      setLoading(false);
      alert('Report created successfully!');
      form.reset();
    }, 1500);
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Stack gap="md">
          <Group>
            <IconCalendarStats size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Create New Report</Title>
          </Group>
          <Text c="dimmed">
            Fill out the form below to create a new report in the system. Fields
            marked with * are required.
          </Text>
        </Stack>
      </Card>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2} spacing="xl">
          {/* Left Column */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Report Information</Title>

              <TextInput
                label="Report Title"
                placeholder="Enter report title"
                withAsterisk
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Description"
                placeholder="Provide a detailed description of the report"
                minRows={3}
                withAsterisk
                {...form.getInputProps('description')}
              />

              <Select
                label="Report Type"
                placeholder="Select report type"
                data={[
                  { value: 'financial', label: 'Financial Report' },
                  { value: 'technical', label: 'Technical Report' },
                  { value: 'research', label: 'Research Report' },
                  { value: 'annual', label: 'Annual Report' },
                  { value: 'quarterly', label: 'Quarterly Report' },
                  { value: 'audit', label: 'Audit Report' },
                  { value: 'project', label: 'Project Report' },
                ]}
                withAsterisk
                {...form.getInputProps('reportType')}
              />

              <MultiSelect
                label="Authors"
                placeholder="Select authors"
                data={[
                  { value: 'john_doe', label: 'John Doe' },
                  { value: 'jane_smith', label: 'Jane Smith' },
                  { value: 'robert_johnson', label: 'Robert Johnson' },
                  { value: 'emily_davis', label: 'Emily Davis' },
                  { value: 'michael_brown', label: 'Michael Brown' },
                ]}
                searchable
                {...form.getInputProps('authors')}
              />

              <NativeSelect
                label="Department"
                data={[
                  { value: '', label: 'Select a department' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'hr', label: 'Human Resources' },
                  { value: 'it', label: 'Information Technology' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'research', label: 'Research & Development' },
                ]}
                {...form.getInputProps('department')}
              />

              <MonthPickerInput
                label="Fiscal Year"
                placeholder="Select fiscal year"
                valueFormat="YYYY"
                {...form.getInputProps('fiscalYear')}
              />

              <DatePickerInput
                label="Publication Date"
                placeholder="Select date"
                clearable
                {...form.getInputProps('publicationDate')}
              />

              <Select
                label="Confidentiality Level"
                placeholder="Select level"
                data={[
                  { value: 'public', label: 'Public' },
                  { value: 'internal', label: 'Internal Only' },
                  { value: 'confidential', label: 'Confidential' },
                  { value: 'restricted', label: 'Restricted' },
                ]}
                {...form.getInputProps('confidentialityLevel')}
              />
            </Stack>
          </Card>

          {/* Right Column */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Additional Details</Title>

              <MultiSelect
                label="Keywords"
                placeholder="Enter keywords"
                data={[
                  { value: 'finance', label: 'Finance' },
                  { value: 'analysis', label: 'Analysis' },
                  { value: 'research', label: 'Research' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'annual', label: 'Annual' },
                  { value: 'budget', label: 'Budget' },
                  { value: 'forecast', label: 'Forecast' },
                  { value: 'performance', label: 'Performance' },
                ]}
                searchable
                {...form.getInputProps('keywords')}
              />

              <Radio.Group
                name="status"
                label="Report Status"
                {...form.getInputProps('status')}
              >
                <Group mt="xs">
                  <Radio value="draft" label="Draft" />
                  <Radio value="review" label="In Review" />
                  <Radio value="final" label="Final" />
                  <Radio value="archived" label="Archived" />
                </Group>
              </Radio.Group>

              <Select
                label="Priority"
                placeholder="Select priority"
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                {...form.getInputProps('priority')}
              />

              <Stack gap="xs">
                <Text size="sm">Quality Rating</Text>
                <Rating
                  value={form.values.qualityRating}
                  onChange={(value) =>
                    form.setFieldValue('qualityRating', value)
                  }
                />
              </Stack>

              <Stack gap="xs">
                <Text size="sm">Budget Range ($)</Text>
                <RangeSlider
                  min={0}
                  max={10000}
                  step={100}
                  minRange={500}
                  label={(value) => `$${value}`}
                  {...form.getInputProps('budgetRange')}
                />
              </Stack>

              <SimpleGrid cols={2}>
                <Checkbox
                  label="Include Executive Summary"
                  {...form.getInputProps('includeExecutiveSummary', {
                    type: 'checkbox',
                  })}
                />
                <Checkbox
                  label="Include Appendices"
                  {...form.getInputProps('includeAppendices', {
                    type: 'checkbox',
                  })}
                />
              </SimpleGrid>

              <Checkbox
                label="Include Graphics & Charts"
                {...form.getInputProps('includeGraphics', { type: 'checkbox' })}
              />

              <MultiSelect
                label="Reviewers"
                placeholder="Select reviewers"
                data={[
                  { value: 'sarah_johnson', label: 'Sarah Johnson' },
                  { value: 'david_miller', label: 'David Miller' },
                  { value: 'lisa_wang', label: 'Lisa Wang' },
                  { value: 'james_wilson', label: 'James Wilson' },
                  { value: 'maria_garcia', label: 'Maria Garcia' },
                ]}
                searchable
                {...form.getInputProps('reviewers')}
              />

              <Textarea
                label="Notes"
                placeholder="Additional notes or comments"
                minRows={2}
                {...form.getInputProps('notes')}
              />

              <FileInput
                label="Attachments"
                placeholder="Upload supporting documents"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                leftSection={<IconUpload size={16} />}
                {...form.getInputProps('attachments')}
              />

              <NumberInput
                label="Estimated Pages"
                placeholder="Enter number of pages"
                min={1}
                max={1000}
              />
            </Stack>
          </Card>
        </SimpleGrid>

        <Group justify="end" mt="xl">
          <Button type="submit" size="md" loading={loading}>
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
}
