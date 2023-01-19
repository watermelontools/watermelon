export default async function getIssue({
  access_token,
  issue_iid,
  owner,
  project_name,
}: {
  access_token: string;
  issue_iid: string;
  owner: string;
  project_name: string;
}): Promise<{ any }> {
  try {
    const urlEncodedProjectPath = encodeURIComponent(
      `${owner}/${project_name}`
    );
    return await fetch(
      `https://gitlab.com/api/v4/projects/${urlEncodedProjectPath}/issues/${issue_iid}/notes`,
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
