import type { DocumentSelector } from 'arangojs/documents';

export type BlockTypeInput = {
  id?: DocumentSelector | string | null;
  name: string;
  title: string;
  description: string;
  options?: any;
};

export type BlockType = {
  id: string;
  name: string;
  options?: any;
  title: string;
  description: string;
};
