async function getMergeRequestsForCommit(
  access_token: string,
  owner: string,
  project_name: string,
  commit: string
) {
  try {
    const urlEncodedProjectPath = encodeURIComponent(
      `${owner}/${project_name}`
    );
    return fetch(
      `https://gitlab.com/api/v4/projects/${urlEncodedProjectPath}/repository/commits/${commit}/merge_requests`,
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
  owner,
  project_name,
}: {
  access_token: string;
  commitList: string;
  project_name: string;
  owner: string;
}) {
  let localCommitList = commitList.split(",");
  const requests = localCommitList.map((commit) =>
    getMergeRequestsForCommit(access_token, owner, project_name, commit)
  );
  const responses = await Promise.all(requests);
  return responses.flatMap((response) => response);
}
