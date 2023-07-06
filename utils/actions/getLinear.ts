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
    const graphql = JSON.stringify({
      query:
        "query SearchIssues($term: String!, $first: Int) {\n  searchIssues(term: $term, first: $first) {\n    nodes {\n      title\n      number\n      url\n    }\n  }\n}\n",
      variables: { term: randomWords.join(" "), first: amount },
    });

    let linearTickets = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${linear_token}`,
      },
      body: graphql,
    })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.log("error", error));
    console.log("linearTickets from API", linearTickets);
    return linearTickets?.data?.searchIssues?.nodes;
  }
}
export default getLinear;
