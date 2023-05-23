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
}) => {
  let query = `EXEC dbo.create_notion @access_token='${access_token}', @token_type='${token_type}', @bot_id='${bot_id}', @workspace_name='${workspace_name}', @workspace_icon='${workspace_icon}', @workspace_id='${workspace_id}', @owner_type='${owner_type}', @owner_user_object='${owner_user_object}', @owner_user_id='${owner_user_id}', @duplicated_template_id='${duplicated_template_id}', @watermelon_user='${watermelon_user}'`;
  let resp = await executeRequest(query);
  return resp;
};
