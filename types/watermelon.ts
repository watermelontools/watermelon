export type MarkdownResponse = string;

export type MarkdownRequest = {
  userLogin: string;
  amount: number;
  value: StandardAPIResponse;
};
export type StandardAPIInput = {
  token: string;
  refresh_token?: string;
  searchText: string;
  amount: number;
  user?: string;
  id?: string;
  owner?: string;
  repo?: string;
  randomWords?: string[];
};
export type StandardAPIResponse = {
  data?: {
    title: string;
    body?: string;
    link?: string;
    number?: number | string;
    image?: string;
  }[];
  fullData?: any;
  error?: string;
};
