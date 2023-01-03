export default async function getAssignedIssues({
  userId,
  access_token,
  project_id,
}) {
  try {
    return await fetch(
      `https://gitlab.com/api/v4/projects/${project_id}/issues?assignee_id=${userId}`,
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
