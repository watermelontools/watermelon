async function getMergeRequestsForCommit(
  access_token: string,
  project_id: string,
  commit: string
) {
  try {
    return fetch(
      `https://gitlab.com/api/v4/projects/${project_id}/repository/commits/${commit}/merge_requests`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((response) => response.json())
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default async function getIssuesByCommits({
  access_token,
  commitList,
  project_id,
}: {
  access_token: string;
  commitList: string;
  project_id: string;
}) {
  let localCommitList = commitList.split(",");
  const requests = localCommitList.map((commit) =>
    getMergeRequestsForCommit(access_token, project_id, commit)
  );
  const responses = await Promise.all(requests);
  return responses.flatMap((response) => response);
}
