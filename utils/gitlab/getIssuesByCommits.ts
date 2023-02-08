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
    return await fetch(
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
      .then((data) => data)
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
  let commentsPromises = responses.map(async (response, index) => {
    return await fetch(
      `https://gitlab.com/api/v4/projects/${response[0].project_id}/merge_requests/${response[0].iid}/notes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )
      .then((commentResp) => commentResp.json())
      .then((data) => {
        responses[index][0].comments = data;
        return responses;
      })
      .catch((error) => {
        console.error(error);
      });
  });
  await Promise.allSettled(commentsPromises);
  return responses.flatMap((response) => response);
}
