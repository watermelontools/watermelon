import { StandardAPIResponse } from "../../types/watermelon";

async function getLinear({
  linear_token,
  randomWords,
  amount = 3,
}): Promise<StandardAPIResponse> {
  let linearValue;

  // create the query with the random words and the owner
  const q = ``;
  if (!linear_token) {
    linearValue = { error: "no linear token" };
    return linearValue;
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
      .catch((error) => console.error("error", error));
    return {
      fullData: linearTickets,
      data: linearTickets?.data?.searchIssues?.nodes.map((result) => {
        return {
          title: result.title,
          number: result.number,
          url: result.url,
        };
      }),
    };
  }
}
export default getLinear;
