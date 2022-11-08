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
  user_username,
  user_title,
  user_real_name,
  user_picture_url,
}) => {
  let query = `EXEC dbo.create_slack @user_token = '${user_token}', @bot_token = '${bot_token}', @bot_user_id = '${bot_user_id}', @user_id = '${user_id}', @team_id = '${team_id}', @team_name = '${team_name}', @bot_scopes = '${bot_scopes}', @user_scopes = '${user_scopes}', @incoming_webhook_channel_id = '${incoming_webhook_channel_id}', @watermelon_user = '${watermelon_user}', @incoming_webhook_configuration_url = '${incoming_webhook_configuration_url}', @incoming_webhook_url = '${incoming_webhook_url}', @is_enterprise_install = '${is_enterprise_install}', @user_username = '${user_username}', @user_title = '${user_title}', @user_real_name = '${user_real_name}', @user_picture_url = '${user_picture_url}'`;
  let resp = await executeRequest(query);
  return resp;
};
