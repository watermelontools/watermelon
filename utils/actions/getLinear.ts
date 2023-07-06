import { Octokit } from "octokit";
type LinearResult = { error: string } | any[];
async function getLinear({
  linear_token,
  randomWords,
  amount = 3,
}): Promise<LinearResult> {
  let ghValue;

  // create the query with the random words and the owner
  const q = ``;
  if (!linear_token) {
    ghValue = { error: "no linear token" };
    return ghValue;
  } else {
    return [];
  }
}
export default getLinear;
