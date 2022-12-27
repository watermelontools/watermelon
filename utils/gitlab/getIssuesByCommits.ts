export default async function getIssuesByCommits({
  access_token,
  commitList,
  project_id,
}: {
  access_token: string;
  commitList: string;
  project_id: string;
}): Promise<{ any }> {
  try {
    return await fetch(
      `https://gitlab.com/api/v4/projects/${project_id}/repository/commits/${commitList}/merge_requests`,
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
