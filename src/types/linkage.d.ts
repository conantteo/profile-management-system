export interface Linkage {
  id: string;
  type: string;
  details: Array<LinkageDetails>;
  remarks: string;
  entity1Alias: string;
  entity2Alias: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  createdBy: string;
  lastUpdatedDate: string;
  lastUpdatedBy: string;
  entity1: {
    id: string;
    idNumber: string;
    type: string;
    name: string;
  };
  entity2: {
    id: string;
    idNumber: string;
    type: string;
    name: string;
  };
}

export interface LinkageDetail {
  id: string;
  detail: string;
  startDate: string;
  endDate: string;
}
