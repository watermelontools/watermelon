import Airtable from "airtable";
import { cpuUsage } from "process";
import { Admin, Settings, Workspace, IncompleteWorkspace } from "./models";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");

export const findWorkspaceRecord = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  return await airtableBase("Workspaces")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({WorkspaceId} = '${workspaceId}')`,
    })
    .firstPage()
    .then((record) => record[0].fields);
};
export const getAllQuestions = async () => {
  let allQuestions = [];
  await airtableBase("en")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${"hobbies"}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function (record) {
        allQuestions.push(record);
      });
      fetchNextPage();
    });
  return allQuestions;
};
export const getAllUnusedQuestions = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  let allQuestions = [];
  await airtableBase("Questions")
    .select({
      // Selecting the first 3 records in Grid view:
      filterByFormula: `FIND("${workspaceId}", {UsedWorkspaceId}) = 0`,
    })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function (record) {
        allQuestions.push({ fields: record.fields, id: record.id });
      });
      fetchNextPage();
    });
  return allQuestions;
};
export const saveWorkspace = async ({
  workspace,
  admin,
  rooms,
  settings,
  crons,
}: {
  workspace: Workspace;
  rooms: string[];
  admin: Admin;
  settings: Settings;
  crons: any;
}) => {
  airtableBase("Workspaces").create(
    [
      {
        fields: workspace,
      },
    ],
    function (err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log("workspace created", record.getId());
        airtableBase("Admins").create(
          [
            {
              fields: admin,
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (admrecord) {
              console.log("created admin", admrecord.getId());
            });
          }
        );
        let roomsToSave = rooms.map((room) => {
          return {
            fields: {
              RoomId: room,
              Workspace: [record.getId()],
            },
          };
        });
        airtableBase("Rooms").create(roomsToSave, function (err, records) {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach(function (roomrecord) {
            console.log("room", roomrecord.getId());
          });
        });
        airtableBase("Settings").create(
          [
            {
              fields: settings,
            },
          ],
          function (err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (record) {
              console.log(record.getId());
            });
          }
        );
      });
    }
  );
};
export const findWorkspaceForLogin = async ({
  workspaceId,
}: {
  workspaceId: string;
}) =>
  await airtableBase("Admins")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `WorkspaceId='${workspaceId}'`,
    })
    .firstPage()
    .then((record) => record);
export const createAdmin = async ({ admin }: { admin: Admin }) => {
  return await airtableBase("Admins").create([{ fields: admin }]);
};
export const createWorkspace = async ({
  workspace,
}: {
  workspace: IncompleteWorkspace;
}) => {
  return await airtableBase("Workspaces").create([{ fields: workspace }]);
};
export const createSettings = async ({
  settings,
  workspaceId,
}: {
  settings: Settings;
  workspaceId: string;
}) => {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId });
  return await airtableBase("Settings").create([
    { fields: { ...settings, WorkspaceId: workspaceRecord.WorkspaceId } },
  ]);
};
export const updateWorkspace = async ({
  workspaceId,
  add_to_slack_token,
}: {
  workspaceId: String;
  add_to_slack_token: any;
}) => {
  let workspaceRecord = await airtableBase("Workspaces")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `WorkspaceId='${workspaceId}'`,
    })
    .firstPage()
    .then((record) => record);
  airtableBase("Workspaces").update([
    {
      id: workspaceRecord[0].id,
      fields: {
        AccessToken: add_to_slack_token.access_token,
        BotUserId: add_to_slack_token.bot_user_id,
        Scope: add_to_slack_token.scope,
        ChannelName: add_to_slack_token.incoming_webhook.channel,
        ChannelId: add_to_slack_token.incoming_webhook.channel_id,
        IncomingWebhookConfigurationURL:
          add_to_slack_token.incoming_webhook.configuration_url,
        IncomingWebhookURL: add_to_slack_token.incoming_webhook.url,
        Enterprise: add_to_slack_token.enterprise,
      },
    },
  ]);
};
export const getSingleQuestion = async ({ questionRecord }) => {
  return await (
    await airtableBase("Questions").find(questionRecord)
  ).fields;
};
export const markQuestionUsed = async ({ questionRecord, WorkspaceId }) => {
  let usedArray = (await getSingleQuestion({ questionRecord })).WorkspacesUsed;  
  let wsUsed = usedArray
  //@ts-ignore
    ? [...new Set([...usedArray, WorkspaceId])]
    : [WorkspaceId];
  return await airtableBase("Questions").update([
    {
      id: questionRecord,
      fields: {
        //@ts-ignore
        WorkspacesUsed: wsUsed,
      },
    },
  ]);
};
export const createUser = async ({
  userId,
  username,
  workspaceId,
  workspaceRecord,
}: {
  userId: string;
  username: string;
  workspaceId?: string;
  workspaceRecord?: string;
}) => {
  let created 
  if (workspaceRecord)
      created = await airtableBase("Users").create([
        {
          fields: {
            Name: username,
            SlackId: userId,
            Workspace: [workspaceRecord],
          },
        },
      ])
  else {
    let record = await (await findWorkspaceRecord({ workspaceId })).RecordId;

      //@ts-ignore
     created = await airtableBase("Users").create([
        {
          fields: {
            Name: username,
            SlackId: userId,
            Workspace: [record],
          },
        },
      ])
    
  }
  console.log("created", created)
  return {
    id: created[0].id,
    fields: created[0].fields,
  }
};
export const findUser = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  username: string;
  workspaceId?: string;
}) => {
    return await airtableBase("Users")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `AND(FIND('${userId}', SlackId)>0, WorkspaceId='${workspaceId}') `,
    })
    .firstPage()
    .then((record) => {
      if(record.length>0){
      return {
        id: record[0].id,
        fields: record[0].fields,
      };
    }
      return false
    });
};
export const findOrCreateUser = async ({
  userId,
  username,
  workspaceId = "",
}: {
  userId: string;
  username: string;
  workspaceId?: string;
}) => {
  let found = await findUser({
    userId,
    username,
    workspaceId,
  });
  if (found) return found;
  return await createUser({ userId, username, workspaceId });
};
export const saveAnswerPicked = async ({
  questionRecordId,
  answerRecordId,
  workspaceId,
  userId,
  username,
}:{
  questionRecordId:string;
  answerRecordId: string;
  workspaceId: string;
  userId: string;
  username: string;
}) => {
  let user = await findOrCreateUser({ userId, username, workspaceId });
  console.log("user", user)
  return await airtableBase("Answerers").create([
    {
      fields: {
        Answer: answerRecordId,
        Question: questionRecordId,
        User: user.id,
      },
    },
  ]);
};
