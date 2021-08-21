export enum CronDays {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
}
export type Workspace = {
  WorkspaceId: string;
  Name: string;
  HasPaid: boolean;
  AccessToken: string;
  Enterprise?: string;
  BotUserId: string;
  Scope: string;
  ChannelName: string;
  ImageOriginal: string;
};

export type Admin = {
  AdminId: string;
  Name: string;
  Token: string;
  Scope: string;
  WorkspaceId?: string[];
  Email: string;
  Image1024: string;
};
export type Settings = {
  WorkspaceId?: string[];
  Language: string;
  Day: CronDays;
  Hour: number;
  Category: string;
  Timezone: string;
};
