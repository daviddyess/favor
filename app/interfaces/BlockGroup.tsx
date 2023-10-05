export type BlockGroupInput = {
  id?: string;
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
