import updateGitHubQueryCounts from "../../../utils/db/github/updateGitHubQueryCounts";

export default async function handler(req, res) {
  let endpointResponse = await updateGitHubQueryCounts();
  res.send(endpointResponse);
}
