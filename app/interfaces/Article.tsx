import type { DocumentSelector } from 'arangojs/documents';
import type { ArticleType } from './ArticleType';

export interface ArticleInput {
  id?: DocumentSelector | string | null;
  articleTypeId: string;
  createdAt: string | null;
  title: string;
  summary: string;
  text: object;
  status: string;
  userId: string;
  images?: {
    base64?: string;
    description?: string;
    file?: string;
    name?: string;
  }[];
}

export interface Article {
  id: string;
  articleType: ArticleType;
  articleTypeId: string;
  createdAt: string;
  slug: string;
  status: string;
  summary: string;
  text: object;
  title: string;
  updatedAt: string;
  userId: string;
  user: { username: string };
}
