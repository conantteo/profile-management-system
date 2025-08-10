export type Attachment = {
  id: string;
  name: string;
  description: string;
};

export type Folder = {
  id: string;
  name: string;
  files: Attachment[];
};
