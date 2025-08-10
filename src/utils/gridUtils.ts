import type {
  IDateComparatorFunc,
  IDateFilterParams,
} from 'ag-grid-enterprise';

export const ddMmYyyyDateFilterParams: IDateFilterParams = {
  comparator: ((filterLocalDateAtMidnight, cellValue): number => {
    if (!cellValue || typeof cellValue !== 'string') return -1;

    const parts = cellValue.split('/');
    if (parts.length !== 3) return -1;
    const [day, month, year] = parts.map(Number);

    const cellDate = new Date(year, month - 1, day);

    // Edge case: invalid date
    if (isNaN(cellDate.getTime())) return -1;

    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }) as IDateComparatorFunc,
};

export const isoDateFilterParams: IDateFilterParams = {
  comparator: ((filterLocalDateAtMidnight, cellValue): number => {
    if (!cellValue || typeof cellValue !== 'string') return -1;
    const cellDate = new Date(cellValue);

    // Edge case: invalid date
    if (isNaN(cellDate.getTime())) return -1;

    // Set to midnight
    cellDate.setHours(0, 0, 0, 0);

    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }) as IDateComparatorFunc,
};
