import {
  Button,
  Card,
  Checkbox,
  Container,
  FileInput,
  Group,
  MultiSelect,
  NumberInput,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconFlag, IconWorld } from '@tabler/icons-react';
import { useState } from 'react';

export function CreateCountryForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      officialName: '',
      isoCode: '',
      continent: '',
      region: '',
      capital: '',
      languages: [],
      currencies: [],
      population: '',
      area: '',
      governmentType: '',
      independenceDate: null,
      description: '',
      flagColors: [],
      isUNMember: true,
      hasEmbassy: false,
      diplomaticRelations: 'full',
      tradeAgreements: [],
      visaRequirements: '',
      travelAdvisory: 'safe',
      notes: '',
      flagImage: null,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? 'Name must be at least 2 characters' : null,
      isoCode: (value) => {
        if (!value) return 'ISO code is required';
        if (!/^[A-Z]{2,3}$/.test(value))
          return 'ISO code must be 2 or 3 uppercase letters';
        return null;
      },
      continent: (value) => (!value ? 'Continent is required' : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setLoading(true);
    // Simulate API call
    console.log('Submitting country data:', values);
    setTimeout(() => {
      setLoading(false);
      alert('Country created successfully!');
      form.reset();
    }, 1500);
  };

  return (
    <Container fluid py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        <Stack gap="md">
          <Group>
            <IconWorld size={32} color="var(--mantine-color-green-6)" />
            <Title order={2}>Create New Country</Title>
          </Group>
          <Text c="dimmed">
            Fill out the form below to create a new country entry in the system.
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
                label="Country Name"
                placeholder="e.g., France"
                withAsterisk
                {...form.getInputProps('name')}
              />

              <TextInput
                label="Official Name"
                placeholder="e.g., French Republic"
                {...form.getInputProps('officialName')}
              />

              <TextInput
                label="ISO Code"
                placeholder="e.g., FR or FRA"
                withAsterisk
                {...form.getInputProps('isoCode')}
              />

              <Select
                label="Continent"
                placeholder="Select continent"
                data={[
                  { value: 'africa', label: 'Africa' },
                  { value: 'antarctica', label: 'Antarctica' },
                  { value: 'asia', label: 'Asia' },
                  { value: 'europe', label: 'Europe' },
                  { value: 'north_america', label: 'North America' },
                  { value: 'oceania', label: 'Oceania' },
                  { value: 'south_america', label: 'South America' },
                ]}
                withAsterisk
                {...form.getInputProps('continent')}
              />

              <TextInput
                label="Region"
                placeholder="e.g., Western Europe"
                {...form.getInputProps('region')}
              />

              <TextInput
                label="Capital City"
                placeholder="e.g., Paris"
                {...form.getInputProps('capital')}
              />

              <MultiSelect
                label="Official Languages"
                placeholder="Select languages"
                data={[
                  { value: 'english', label: 'English' },
                  { value: 'french', label: 'French' },
                  { value: 'spanish', label: 'Spanish' },
                  { value: 'arabic', label: 'Arabic' },
                  { value: 'mandarin', label: 'Mandarin' },
                  { value: 'russian', label: 'Russian' },
                  { value: 'portuguese', label: 'Portuguese' },
                  { value: 'german', label: 'German' },
                  { value: 'japanese', label: 'Japanese' },
                ]}
                searchable
                {...form.getInputProps('languages')}
              />

              <MultiSelect
                label="Currencies"
                placeholder="Select currencies"
                data={[
                  { value: 'usd', label: 'US Dollar (USD)' },
                  { value: 'eur', label: 'Euro (EUR)' },
                  { value: 'gbp', label: 'British Pound (GBP)' },
                  { value: 'jpy', label: 'Japanese Yen (JPY)' },
                  { value: 'cny', label: 'Chinese Yuan (CNY)' },
                  { value: 'inr', label: 'Indian Rupee (INR)' },
                  { value: 'aud', label: 'Australian Dollar (AUD)' },
                  { value: 'cad', label: 'Canadian Dollar (CAD)' },
                ]}
                searchable
                {...form.getInputProps('currencies')}
              />

              <NumberInput
                label="Population"
                placeholder="Enter population"
                min={0}
                thousandSeparator=","
                {...form.getInputProps('population')}
              />
            </Stack>
          </Card>

          {/* Right Column */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={4}>Additional Details</Title>

              <NumberInput
                label="Area (km²)"
                placeholder="Enter land area"
                min={0}
                thousandSeparator=","
                {...form.getInputProps('area')}
              />

              <Select
                label="Government Type"
                placeholder="Select government type"
                data={[
                  { value: 'republic', label: 'Republic' },
                  { value: 'federal_republic', label: 'Federal Republic' },
                  {
                    value: 'constitutional_monarchy',
                    label: 'Constitutional Monarchy',
                  },
                  { value: 'absolute_monarchy', label: 'Absolute Monarchy' },
                  {
                    value: 'parliamentary_democracy',
                    label: 'Parliamentary Democracy',
                  },
                  {
                    value: 'presidential_system',
                    label: 'Presidential System',
                  },
                  { value: 'socialist_state', label: 'Socialist State' },
                  { value: 'theocracy', label: 'Theocracy' },
                ]}
                {...form.getInputProps('governmentType')}
              />

              <DatePickerInput
                label="Independence Date"
                placeholder="Select date"
                clearable
                {...form.getInputProps('independenceDate')}
              />

              <Textarea
                label="Description"
                placeholder="Brief description of the country"
                minRows={3}
                {...form.getInputProps('description')}
              />

              <MultiSelect
                label="Flag Colors"
                placeholder="Select colors"
                data={[
                  { value: 'red', label: 'Red' },
                  { value: 'blue', label: 'Blue' },
                  { value: 'green', label: 'Green' },
                  { value: 'yellow', label: 'Yellow' },
                  { value: 'white', label: 'White' },
                  { value: 'black', label: 'Black' },
                  { value: 'orange', label: 'Orange' },
                  { value: 'purple', label: 'Purple' },
                ]}
                {...form.getInputProps('flagColors')}
              />

              <Group grow>
                <Checkbox
                  label="UN Member"
                  {...form.getInputProps('isUNMember', { type: 'checkbox' })}
                />
                <Checkbox
                  label="Has Embassy"
                  {...form.getInputProps('hasEmbassy', { type: 'checkbox' })}
                />
              </Group>

              <SegmentedControl
                fullWidth
                data={[
                  { value: 'full', label: 'Full Relations' },
                  { value: 'partial', label: 'Partial Relations' },
                  { value: 'none', label: 'No Relations' },
                ]}
                {...form.getInputProps('diplomaticRelations')}
              />

              <MultiSelect
                label="Trade Agreements"
                placeholder="Select agreements"
                data={[
                  { value: 'wto', label: 'World Trade Organization (WTO)' },
                  { value: 'eu', label: 'European Union (EU)' },
                  { value: 'nafta', label: 'NAFTA' },
                  { value: 'asean', label: 'ASEAN' },
                  { value: 'mercosur', label: 'Mercosur' },
                  { value: 'cptpp', label: 'CPTPP' },
                  { value: 'rcep', label: 'RCEP' },
                ]}
                searchable
                {...form.getInputProps('tradeAgreements')}
              />

              <Select
                label="Visa Requirements"
                placeholder="Select visa policy"
                data={[
                  { value: 'visa_free', label: 'Visa-Free' },
                  { value: 'visa_on_arrival', label: 'Visa on Arrival' },
                  { value: 'e_visa', label: 'E-Visa' },
                  { value: 'visa_required', label: 'Visa Required' },
                  { value: 'restricted', label: 'Restricted' },
                ]}
                {...form.getInputProps('visaRequirements')}
              />

              <SegmentedControl
                fullWidth
                data={[
                  { value: 'safe', label: 'Safe' },
                  { value: 'caution', label: 'Exercise Caution' },
                  { value: 'reconsider', label: 'Reconsider Travel' },
                  { value: 'do_not_travel', label: 'Do Not Travel' },
                ]}
                {...form.getInputProps('travelAdvisory')}
              />

              <Textarea
                label="Notes"
                placeholder="Additional notes or comments"
                minRows={2}
                {...form.getInputProps('notes')}
              />

              <FileInput
                label="Flag Image"
                placeholder="Upload flag image"
                accept="image/png,image/jpeg,image/svg+xml"
                leftSection={<IconFlag size={16} />}
                {...form.getInputProps('flagImage')}
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
