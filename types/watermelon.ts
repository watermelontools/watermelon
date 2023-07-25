export type MarkdownResponse = string;

export type MarkdownRequest = {
  userLogin: string;
  amount: number;
  value: StandardAPIResponse;
};
export type StandardAPIResponse = {
  data?: {
    title: string;
    body?: string;
    link?: string;
    number?: number | string;
  }[];
  fullData?: any;
  error?: string;
};