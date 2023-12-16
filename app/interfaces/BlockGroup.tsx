import type { DocumentSelector } from 'arangojs/documents';

export type BlockGroupInput = {
  id?: DocumentSelector | string | null;
  name: string;
  title: string;
  description: string;
  status: string;
};

export type BlockGroup = {
  id: string;
  name: string;
  title?: string;
  description?: string;
  status: string;
};
