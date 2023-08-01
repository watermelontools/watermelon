import executeRequest from "../azuredb";

export default async ({
  access_token,
  token_type,
  bot_id,
  workspace_name,
  workspace_icon,
  workspace_id,
  owner_type,
  owner_user_object,
  owner_user_id,
  duplicated_template_id,
  watermelon_user,
  user_id,
  user_name,
  user_avatar_url,
  user_email,
}) => {
  let query = `EXEC dbo.create_notion @access_token='${access_token}', @token_type='${token_type}', @bot_id='${bot_id}', @workspace_name='${workspace_name}', @workspace_icon='${workspace_icon}', @workspace_id='${workspace_id}', @owner_type='${owner_type}', @owner_user_object='${owner_user_object}', @owner_user_id='${owner_user_id}', @duplicated_template_id='${duplicated_template_id}', @watermelon_user='${watermelon_user}', @user_id='${user_id}', @user_name='${user_name}', @user_avatar_url='${user_avatar_url}', @user_email='${user_email}'`;
  let resp = await executeRequest(query);
  return resp;
};
