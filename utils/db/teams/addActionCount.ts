import executeRequest from "../azuredb";

export default async function incrementGithubAppUses(req, res) {
  const team_id = req.body.team_id;

  if (!team_id) {
    res.status(400).json({ error: "Missing team_id in request body" });
    return;
  }

  try {
    let data = await executeRequest(
      `EXEC dbo.increment_github_app_uses @team_id=${team_id}`
    );
    res.status(200).json({
      message: "Successfully incremented github_app_uses count",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to increment github_app_uses count",
      details: err,
    });
  }
}
