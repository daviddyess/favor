export type BlockInput = {
  id?: string;
  name: string;
  title: string;
  content?: any;
  Content: any | null;
  status: string;
};

export type Block = {
  id: string;
  name: string;
  title?: string;
  content?: any;
  Content: any | null;
  status: string;
};
