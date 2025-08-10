import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { AgGridReact } from 'ag-grid-react';
import type React from 'react';
import { agGridTheme } from '../../App';
import type { HistoricalRecord } from '../../types/historicalRecord';
import { HX_DATE_COLUMN_DEF } from '../Grid';

interface HistoricalRecordsSegmentProps {
  ref?: React.Ref<HTMLDivElement>;
  historicalRecords: HistoricalRecord[];
}

export const HistoricalRecordsSegment: React.FC<
  HistoricalRecordsSegmentProps
> = ({ ref, historicalRecords = [] }) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      id="historical-records"
      ref={ref}
      mb="xl"
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Historical Records</Title>
        </Group>
        <Text c="dimmed" mb="md">
          Past submissions related to this entity.
        </Text>
        <div style={{ height: 400, width: '100%' }}>
          <AgGridReact
            theme={agGridTheme}
            columnDefs={[
              {
                field: 'id',
                headerName: 'ID',
                filter: 'agTextColumnFilter',
                filterParams: {
                  buttons: ['apply', 'reset'],
                },
                sortable: true,
              },
              {
                field: 'submissionNo',
                headerName: 'Submission No',
                filter: 'agTextColumnFilter',
                filterParams: {
                  buttons: ['apply', 'reset'],
                },
                sortable: true,
              },
              {
                field: 'startDate',
                headerName: 'Start Date',
                ...HX_DATE_COLUMN_DEF,
              },
              {
                field: 'endDate',
                headerName: 'End Date',
                ...HX_DATE_COLUMN_DEF,
              },
              {
                field: 'status',
                headerName: 'Status',
                filter: 'agSetColumnFilter',
                sortable: true,
                cellRenderer: (params: { value: string }) => (
                  <Badge
                    color={params.value === 'PROCESSED' ? 'green' : 'gray'}
                  >
                    {params.value}
                  </Badge>
                ),
              },
            ]}
            rowData={historicalRecords}
            defaultColDef={{
              flex: 1,
              minWidth: 100,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={20}
          />
        </div>
      </Stack>
    </Card>
  );
};
