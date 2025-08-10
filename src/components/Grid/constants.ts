import type { ColDef } from 'ag-grid-enterprise';
import {
  ddMmYyyyDateFilterParams,
  isoDateFilterParams,
} from '../../utils/gridUtils';

export const HX_TEXT_COLUMN_DEF: Partial<ColDef> = {
  filter: 'agTextColumnFilter',
  filterParams: {
    buttons: ['apply', 'reset'],
  },
  sortable: true,
  valueFormatter: (params) => params.value || '-',
};

export const HX_SET_COLUMN_DEF: Partial<ColDef> = {
  filter: 'agSetColumnFilter',
  sortable: true,
  valueFormatter: (params) => params.value || '-',
};

export const HX_DATE_COLUMN_DEF: Partial<ColDef> = {
  filter: 'agDateColumnFilter',
  filterParams: {
    buttons: ['reset'],
    ...ddMmYyyyDateFilterParams,
  },
  sortable: true,
  valueFormatter: (params) => params.value || '-',
};

export const HX_ISO_DATE_COLUMN_DEF: Partial<ColDef> = {
  filter: 'agDateColumnFilter',
  filterParams: {
    buttons: ['reset'],
    ...isoDateFilterParams,
  },
  sortable: true,
  valueFormatter: (params) => params.value || '-',
};

export const HX_ACTION_COLUMN_DEF: Partial<ColDef> = {
  headerName: 'Actions',
  field: 'actions',
  pinned: 'right',
  width: 80,
  sortable: false,
  filter: false,
  resizable: false,
};
