import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = require("airtable").base("appmBwyPWKFJaCQvA");

let teams = [];
export default async function handler(req, res) {
  for (let index = 0; index < teams.length; index++) {
    const element = teams[index];

    base("Workspaces").create(
      [
        {
          fields: {
            WorkspaceId: element.add_to_slack_token.team.id,
            Name: element.add_to_slack_token.team.name,
            HasPaid: true,
            AccessToken: element.add_to_slack_token.access_token,
            BotUserId: element.add_to_slack_token.bot_user_id,
            Scope: element.add_to_slack_token.scope,
            ChannelName: element.add_to_slack_token.incoming_webhook.channel,
            ChannelId: element.add_to_slack_token.incoming_webhook.channel_id,
            ImageOriginal: element.loggedUser.team.image_original,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
        records.forEach(function (record) {
          console.log("workspace created", record.getId());
          base("Admins").create(
            [
              {
                fields: {
                  AdminId: element.loggedUser.user.id,
                  Name: element.loggedUser.user.name,
                  Token: element.sign_in_token.authed_user.access_token,
                  Scope: element.sign_in_token.authed_user.scope,
                  Workspace: [record.getId()],
                  Email: element.loggedUser.user.email,
                  Image1024: element.loggedUser.user.image_1024,
                },
              },
            ],
            function (err, records) {
              if (err) {
                console.error(err);
                return;
              }
              records.forEach(function (admrecord) {
                console.log("creeated admin", admrecord.getId());
              });
            }
          );
          let rooms = element.room_ids.map((room) => {
            return {
              fields: {
                RoomId: room,
                Workspaces: [record.getId()],
              },
            };
          });
          base("Rooms").create(rooms, function (err, records) {
            if (err) {
              console.error(err);
              return;
            }
            records.forEach(function (roomrecord) {
              console.log("room", roomrecord.getId());
            });
          });
        });
      }
    );
  }
}
