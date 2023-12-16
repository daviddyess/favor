import type { DocumentSelector } from 'arangojs/documents';
import type { ArticleType } from './ArticleType';

export type BlockInput = {
  id?: DocumentSelector | string | null;
  blockTypeId: string;
  name: string;
  title: string;
  content?: any;
  Content: any | null;
  status: string;
};

export type Block = {
  id: string;
  blockType: ArticleType;
  blockTypeId: string;
  name: string;
  title?: string;
  content?: any;
  Content: any | null;
  status: string;
};
