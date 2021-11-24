import Airtable from "airtable";
import logger from "../../logger/logger";
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
  logger.info({
    message: "AIRTABLE-FUNC_FIND_WORKSPACE_RECORD",
    input: { workspaceId },
  });
  return await airtableBase("Workspaces")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({WorkspaceId} = '${workspaceId}')`,
    })
    .firstPage()
    .then((record) => {
      return { id: record[0].id, fields: record[0].fields };
    });
};
export const getAllQuestions = async () => {
  let allQuestions = [];
  logger.info({ message: "AIRTABLE-FUNC_GET_ALL_QUESTIONS" });
  await airtableBase("en")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${"hobbies"}')`,
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
export const getAllUnusedQuestions = async ({
  workspaceId,
  lang,
}: {
  workspaceId: string;
  lang: "es" | "en";
}) => {
  let allQuestions = [];
  logger.info({ message: "AIRTABLE-FUNC_GET_ALL_UNUSED_QUESTIONS" });
  await airtableBase("Questions")
    .select({
      filterByFormula: `AND(FIND("${workspaceId}", {UsedWorkspaceId}) = 0,{Language}= "${lang}")`,
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
  logger.info({
    message: "AIRTABLE-FUNC_SAVE_WORKSPACE",
    input: {
      workspace,
      admin,
      rooms,
      settings,
      crons,
    },
  });
  await airtableBase("Workspaces").create(
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
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_FIND_WORKSPACE_FOR_LOGIN",
    input: { workspaceId },
  });
  return await airtableBase("Admins")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `WorkspaceId='${workspaceId}'`,
    })
    .firstPage()
    .then((record) => record);
};
export const createAdmin = async ({ admin }: { admin: Admin }) => {
  logger.info({ message: "AIRTABLE-FUNC_CREATE_ADMIN", input: { admin } });
  return await airtableBase("Admins").create([{ fields: admin }]);
};
export const createWorkspace = async ({
  workspace,
}: {
  workspace: IncompleteWorkspace;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_WORKSPACE",
    input: { workspace },
  });
  return await airtableBase("Workspaces").create([{ fields: workspace }]);
};
export const createSettings = async ({
  settings,
  workspaceId,
}: {
  settings: Settings;
  workspaceId: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_SETTINGS",
    input: {
      settings,
      workspaceId,
    },
  });
  let workspaceRecord = await findWorkspaceRecord({ workspaceId });
  return await airtableBase("Settings").create([
    {
      fields: { ...settings, WorkspaceId: workspaceRecord.fields.WorkspaceId },
    },
  ]);
};
export const updateWorkspace = async ({
  workspaceId,
  add_to_slack_token,
}: {
  workspaceId: String;
  add_to_slack_token: any;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_UPDATE_WORKSPACE",
    input: {
      workspaceId,
    },
  });
  let workspaceRecord = await airtableBase("Workspaces")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `WorkspaceId='${workspaceId}'`,
    })
    .firstPage()
    .then((record) => record);
  await airtableBase("Workspaces").update([
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
  logger.info({
    message: "AIRTABLE-FUNC_GET_SINGLE_QUESTION",
    input: {
      questionRecord,
    },
  });
  return await (
    await airtableBase("Questions").find(questionRecord)
  ).fields;
};
export const markQuestionUsed = async ({ questionRecord, workspaceId }) => {
  logger.info({
    message: "AIRTABLE-FUNC_MARK_QUESTION_USED",
    input: {
      questionRecord,
      workspaceId,
    },
  });
  let usedArray = (await getSingleQuestion({ questionRecord })).WorkspacesUsed;
  let wsUsed = usedArray
    ? //@ts-ignore
    [...new Set([...usedArray, workspaceId])]
    : [workspaceId];
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
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_USER",
    input: {
      userId,
      username,
      workspaceId,
      workspaceRecord,
    },
  });
  let created;
  if (workspaceRecord)
    created = await airtableBase("Users").create([
      {
        fields: {
          Name: username,
          SlackId: userId,
          Workspace: [workspaceRecord],
        },
      },
    ]);
  else {
    let record = await (
      await findWorkspaceRecord({ workspaceId })
    ).fields.RecordId;

    //@ts-ignore
    created = await airtableBase("Users").create([
      {
        fields: {
          Name: username,
          SlackId: userId,
          Workspace: [record],
        },
      },
    ]);
  }
  return {
    id: created[0].id,
    fields: created[0].fields,
  };
};
export const findUser = async ({
  userId,
  workspaceId,
}: {
  userId: string;
  username: string;
  workspaceId?: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_FIND_USER",
    input: {
      userId,
      workspaceId,
    },
  });
  return await airtableBase("Users")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `AND(FIND('${userId}', SlackId)>0, WorkspaceId='${workspaceId}') `,
    })
    .firstPage()
    .then((record) => {
      if (record.length > 0) {
        return {
          id: record[0].id,
          fields: record[0].fields,
        };
      }
      return false;
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
  logger.info({
    message: "AIRTABLE-FUNC_FIND_OR_CREATE_USER",
    input: {
      userId,
      workspaceId,
    },
  });
  let found = await findUser({
    userId,
    username,
    workspaceId,
  });
  if (found) return found;
  return await createUser({ userId, username, workspaceId });
};
export const createAnswerer = async ({
  userId,
  questionRecord,
  answerRecord,
  username,
  workspaceRecord,
}: {
  userId: string;
  questionRecord: string;
  answerRecord: string;
  username: string;
  workspaceRecord: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_ANSWERER",
    input: {
      userId,
      questionRecord,
      answerRecord,
      username,
      workspaceRecord,
    },
  });
  let createdUser = await createUser({ userId, username, workspaceRecord });

  let created = await airtableBase("Answerers").create([
    {
      fields: {
        Answer: [answerRecord],
        Question: [questionRecord],
        User: [createdUser.id],
      },
    },
  ]);
  return {
    id: created[0].id,
    fields: created[0].fields,
  };
};
export const findAnswerer = async ({
  userId,
  questionRecord,
  answerRecord,
}: {
  userId: string;
  questionRecord: string;
  answerRecord: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_FIND_ANSWERER",
    input: {
      userId,
      questionRecord,
      answerRecord,
    },
  });
  let filterFormula = `AND(SlackId='${userId}',
  QuestionRecordId='${questionRecord}',
  TimeSinceAnswered<1440)`;
  return await airtableBase("Answerers")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: filterFormula,
    })
    .firstPage()
    .then((record) => {
      if (record[0]) return { id: record[0].id, fields: record[0].fields };
      else return false;
    });
};
export const CreateOrEditAnswerer = async ({
  userId,
  questionRecord,
  answerRecord,
  workspaceRecordId,
  username,
}: {
  userId: string;
  questionRecord: string;
  answerRecord: string;
  workspaceRecordId: string;
  username: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_OR_EDIT_ANSWERER",
    input: {
      userId,
      questionRecord,
      answerRecord,
      workspaceRecordId,
      username,
    },
  });
  let found = await findAnswerer({
    userId,
    questionRecord,
    answerRecord,
  });
  if (found) {
    await airtableBase("Answerers").update([
      {
        id: found.id,
        fields: {
          Answer: [answerRecord],
        },
      },
    ]);
    return found;
  }
  return await createAnswerer({
    userId,
    questionRecord,
    answerRecord,
    workspaceRecord: workspaceRecordId,
    username,
  });
};
export const saveAnswerPicked = async ({
  questionRecord,
  answerRecord,
  workspaceId,
  userId,
  username,
  workspaceRecordId,
}: {
  questionRecord: string;
  answerRecord: string;
  workspaceId: string;
  userId: string;
  username: string;
  workspaceRecordId: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_SAVE_ANSWER_PICKED",
    input: {
      questionRecord,
      answerRecord,
      workspaceId,
      userId,
      username,
      workspaceRecordId,
    },
  });
  let answerer = await CreateOrEditAnswerer({
    userId,
    questionRecord,
    answerRecord,
    workspaceRecordId,
    username,
  });
  return answerer;
};
export const getRooms = async ({ workspaceId }: { workspaceId: string }) => {
  logger.info({
    message: "AIRTABLE-FUNC_GET_ROOMS",
    input: {
      workspaceId,
    },
  });
  let rooms = [];
  await airtableBase("Rooms")
    .select({
      filterByFormula: `FIND('${workspaceId}', {WorkspaceId})>0`,
    })
    .firstPage()
    .then((records) => {
      records.map((record) => {
        rooms.push({ id: record.id, fields: record.fields });
      });
    });
  return rooms;
};
export const getLastWeekAnswerers = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_GET_LAST_WEEK_ANSWERERS",
    input: {
      workspaceId,
    },
  });
  let answerers = [];
  await airtableBase("Answerers")
    .select({
      filterByFormula: `AND(
     FIND('${workspaceId}', {WorkspaceId})>0,
     TimeSinceAnswered<10080
     )`,
    })
    .firstPage()
    .then((records) => {
      records.map((record) => {
        answerers.push({ id: record.id, fields: record.fields });
      });
    });
  return answerers;
};

export const createQuestion = async ({
  Question,
  Language,
  Icebreaker1,
  Icebreaker2,
  Icebreaker3,
  ContrarianIcebreaker1,
  ContrarianIcebreaker2,
  ContrarianIcebreaker3,
}: {
  Question: string;
  Language: string;
  Icebreaker1: string;
  Icebreaker2: string;
  Icebreaker3: string;
  ContrarianIcebreaker1: string;
  ContrarianIcebreaker2: string;
  ContrarianIcebreaker3: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_QUESTION",
    input: {
      Question,
      Language,
      Icebreaker1,
      Icebreaker2,
      Icebreaker3,
      ContrarianIcebreaker1,
      ContrarianIcebreaker2,
      ContrarianIcebreaker3,
    },
  });

  let created = await airtableBase("Questions").create([
    {
      fields: {
        Question,
        Language,
        Icebreaker1,
        Icebreaker2,
        Icebreaker3,
        ContrarianIcebreaker1,
        ContrarianIcebreaker2,
        ContrarianIcebreaker3,
      },
    },
  ]);
  return {
    id: created[0].id,
    fields: created[0].fields,
  };
};

export const createAnswer = async ({
  AnswerTitle,
  Image,
  IsContrarian,
  QuestionsA,
  QuestionsB,
  QuestionsC,
  QuestionsD,
}: {
  AnswerTitle: string;
  Image: string;
  IsContrarian: boolean;
  QuestionsA?: string[];
  QuestionsB?: string[];
  QuestionsC?: string[];
  QuestionsD?: string[];
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_ANSWER",
    input: {
      AnswerTitle,
      Image,
      IsContrarian,
      QuestionsA,
      QuestionsB,
      QuestionsC,
      QuestionsD,
    },
  });

  let created = await airtableBase("Answers").create([
    {
      fields: {
        AnswerTitle,
        Image,
        IsContrarian,
        QuestionsA,
        QuestionsB,
        QuestionsC,
        QuestionsD,
      },
    },
  ]);
  return {
    id: created[0].id,
    fields: created[0].fields,
  };
};

export const createRoom = async ({
  roomId,
  workspaceRecordId,
  name,
}: {
  roomId: string;
  workspaceRecordId: string;
  name: string;
}) => {
  logger.info({
    message: "AIRTABLE-FUNC_CREATE_ROOM",
    input: {
      roomId,
      workspaceRecordId,
      name,
    },
  });
  let created = await airtableBase("Rooms").create([
    {
      fields: {
        RoomId: roomId,
        Workspace: [workspaceRecordId],
        Name: name,
      },
    },
  ]);
  return {
    id: created[0].id,
    fields: created[0].fields,
  };
};
