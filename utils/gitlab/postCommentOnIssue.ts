export default async function postCommentOnIssue({
  access_token,
  issue_iid,
  owner,
  project_name,
  comment_body,
}: {
  access_token: string;
  issue_iid: string;
  owner: string,
  project_name: string,
  comment_body: string;
}): Promise<{ any }> {
  try {
    const urlEncodedProjectPath = encodeURIComponent(`${owner}/${project_name}`);
    return await fetch(
      `https://gitlab.com/api/v4/projects/${urlEncodedProjectPath}/issues/${issue_iid}/notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          body: comment_body,
        }),
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
