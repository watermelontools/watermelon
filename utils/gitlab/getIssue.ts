export default async function getIssue({
  access_token,
  issue_iid,
  project_id,
}: {
  access_token: string;
  issue_iid: string;
  project_id: string;
}): Promise<{ any }> {
  try {
    return await fetch(
      `https://gitlab.com/api/v4/projects/${project_id}/issues/${issue_iid}`,
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
