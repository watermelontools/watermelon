import executeRequest from "../azuredb";

export default async ({
  user_token,
  bot_token,
  bot_user_id,
  user_id,
  team_id,
  team_name,
  bot_scopes,
  user_scopes,
  incoming_webhook_channel_id,
  watermelon_user,
  incoming_webhook_configuration_url,
  incoming_webhook_url,
  is_enterprise_install,
}) => {
  let query = `EXEC dbo.create_slack @`;
  let resp = await executeRequest(query);
  return resp;
};
