export interface DataObjectField {
  default: string;
  disabled: boolean;
  hidden: boolean;
  label: string;
  list: boolean;
  name: string;
  order: number;
  placeholder: string;
  source?: string;
  type: string;
}

export interface DataObject {
  id: string | null;
  createdAt?: string;
  description: string;
  name: string;
  fields: DataObjectField[];
  slug: string;
  slugFormat: string;
  status: string;
  title: string;
  updatedAt?: string;
}
