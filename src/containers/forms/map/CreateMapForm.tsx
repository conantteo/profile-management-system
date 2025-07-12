import {
  Button,
  Card,
  Checkbox,
  ColorInput,
  Container,
  FileInput,
  Group,
  MultiSelect,
  Select,
  SimpleGrid,
  Slider,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconMap, IconUpload } from '@tabler/icons-react';
import { useState } from 'react';

export function CreateMapForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      mapType: '',
      scale: '',
      dimensions: '',
      publicationDate: null,
      publisher: '',
      language: '',
      regions: [],
      isDigital: false,
      isPrintable: false,
      hasLegend: true,
      primaryColor: '#4dabf7',
      detailLevel: 50,
      notes: '',
      tags: [],
      file: null,
      coordinates: {
        latitude: '',
        longitude: '',
      },
      accessLevel: 'public',
    },
    validate: {
      title: (value) =>
        value.length < 3 ? 'Title must be at least 3 characters' : null,
      description: (value) =>
        value.length < 10 ? 'Description must be at least 10 characters' : null,
      mapType: (value) => (!value ? 'Map type is required' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    // Simulate API call
    console.log('Submitting map data:', values);
    setTimeout(() => {
      setLoading(false);
      alert('Map created successfully!');
      form.reset();
    }, 1500);
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Stack gap="md">
          <Group>
            <IconMap size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Create New Map</Title>
          </Group>
          <Text c="dimmed">
            Fill out the form below to create a new map entry in the system.
            Fields marked with * are required.
          </Text>
        </Stack>
      </Card>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <SimpleGrid cols={2} spacing="xl">
          {/* Left Column */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Basic Information</Title>

              <TextInput
                label="Map Title"
                placeholder="Enter map title"
                withAsterisk
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Description"
                placeholder="Provide a detailed description of the map"
                minRows={3}
                withAsterisk
                {...form.getInputProps('description')}
              />

              <Select
                label="Map Type"
                placeholder="Select map type"
                data={[
                  { value: 'topographic', label: 'Topographic' },
                  { value: 'political', label: 'Political' },
                  { value: 'road', label: 'Road' },
                  { value: 'thematic', label: 'Thematic' },
                  { value: 'historical', label: 'Historical' },
                  { value: 'physical', label: 'Physical' },
                ]}
                withAsterisk
                {...form.getInputProps('mapType')}
              />

              <TextInput
                label="Scale"
                placeholder="e.g., 1:10,000"
                {...form.getInputProps('scale')}
              />

              <TextInput
                label="Dimensions"
                placeholder="e.g., 24 x 36 inches"
                {...form.getInputProps('dimensions')}
              />

              <DatePickerInput
                label="Publication Date"
                placeholder="Select date"
                clearable
                {...form.getInputProps('publicationDate')}
              />

              <TextInput
                label="Publisher"
                placeholder="Enter publisher name"
                {...form.getInputProps('publisher')}
              />

              <Select
                label="Language"
                placeholder="Select primary language"
                data={[
                  { value: 'english', label: 'English' },
                  { value: 'spanish', label: 'Spanish' },
                  { value: 'french', label: 'French' },
                  { value: 'german', label: 'German' },
                  { value: 'chinese', label: 'Chinese' },
                  { value: 'japanese', label: 'Japanese' },
                  { value: 'arabic', label: 'Arabic' },
                ]}
                {...form.getInputProps('language')}
              />
            </Stack>
          </Card>

          {/* Right Column */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Additional Details</Title>

              <MultiSelect
                label="Regions Covered"
                placeholder="Select regions"
                data={[
                  { value: 'north_america', label: 'North America' },
                  { value: 'south_america', label: 'South America' },
                  { value: 'europe', label: 'Europe' },
                  { value: 'asia', label: 'Asia' },
                  { value: 'africa', label: 'Africa' },
                  { value: 'oceania', label: 'Oceania' },
                  { value: 'antarctica', label: 'Antarctica' },
                ]}
                searchable
                {...form.getInputProps('regions')}
              />

              <SimpleGrid cols={2}>
                <Checkbox
                  label="Digital Version Available"
                  {...form.getInputProps('isDigital', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Printable"
                  {...form.getInputProps('isPrintable', { type: 'checkbox' })}
                />
              </SimpleGrid>

              <Switch
                label="Includes Legend"
                checked={form.values.hasLegend}
                onChange={(event) =>
                  form.setFieldValue('hasLegend', event.currentTarget.checked)
                }
              />

              <ColorInput
                label="Primary Color"
                format="hex"
                swatches={[
                  '#25262b',
                  '#868e96',
                  '#fa5252',
                  '#e64980',
                  '#be4bdb',
                  '#7950f2',
                  '#4c6ef5',
                  '#228be6',
                  '#15aabf',
                  '#12b886',
                  '#40c057',
                  '#82c91e',
                  '#fab005',
                  '#fd7e14',
                ]}
                {...form.getInputProps('primaryColor')}
              />

              <Stack gap="xs">
                <Text size="sm">Detail Level</Text>
                <Slider
                  min={0}
                  max={100}
                  label={(value) => `${value}%`}
                  {...form.getInputProps('detailLevel')}
                />
              </Stack>

              <SimpleGrid cols={2}>
                <TextInput
                  label="Latitude"
                  placeholder="e.g., 40.7128"
                  {...form.getInputProps('coordinates.latitude')}
                />
                <TextInput
                  label="Longitude"
                  placeholder="e.g., -74.0060"
                  {...form.getInputProps('coordinates.longitude')}
                />
              </SimpleGrid>

              <Select
                label="Access Level"
                placeholder="Select access level"
                data={[
                  { value: 'public', label: 'Public' },
                  { value: 'restricted', label: 'Restricted' },
                  { value: 'private', label: 'Private' },
                ]}
                {...form.getInputProps('accessLevel')}
              />

              <Textarea
                label="Notes"
                placeholder="Additional notes or comments"
                minRows={2}
                {...form.getInputProps('notes')}
              />

              <FileInput
                label="Upload Map File"
                placeholder="Click to upload or drag file here"
                accept="image/png,image/jpeg,application/pdf"
                leftSection={<IconUpload size={16} />}
                {...form.getInputProps('file')}
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
