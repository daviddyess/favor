export interface ArticleTypeInput {
  id: string | null;
  createdAt: string;
  name: string;
  title: string;
  description: string;
  options: {
    slugFormat: string;
    usePublishedDate: boolean;
    useSetDateAndTime: boolean;
    useStatus: boolean;
    useSummary: boolean;
    useSummaryAsIntro: boolean;
    useImage: boolean;
  };
  slug: string;
  status: string;
}

export interface ArticleType {
  id: string;
  createdAt?: string;
  description?: string;
  name: string;
  options?: {
    slugFormat: string;
    usePublishedDate: boolean;
    useSetDateAndTime: boolean;
    useStatus: boolean;
    useSummary: boolean;
    useSummaryAsIntro: boolean;
    useImage: boolean;
  };
  slug?: string;
  status?: string;
  title: string;
  updatedAt?: string;
}
