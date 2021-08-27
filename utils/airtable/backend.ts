import Airtable from "airtable";
import { Admin, Settings, Workspace, IncompleteWorkspace } from "./models";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");

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
export const findWorkspaceForLogin = async ({ adminId }: { adminId: string }) =>
  await airtableBase("Admins")
    .select({
      // Selecting the first 3 records in Grid view:
      maxRecords: 1,
      filterByFormula: `AdminId='${adminId}'`,
    })
    .firstPage()
    .then((record) => {
      console.log(record);
      return record;
    });
export const createUser = async ({ admin }: { admin: Admin }) => {
  return await airtableBase("Admins").create([
    {
      fields: admin,
    },
  ]);
};
export const createWorkspace = async ({
  workspace,
}: {
  workspace: IncompleteWorkspace;
}) => {
  return await airtableBase("Workspaces").create([
    {
      fields: workspace,
    },
  ]);
};
