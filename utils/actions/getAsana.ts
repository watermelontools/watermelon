import { StandardAPIResponse } from "../../types/watermelon";

async function getAsana({
  access_token,
  user,
  randomWords,
  workspace,
  amount = 3,
}): Promise<StandardAPIResponse> {
  // Error handling
  if (!access_token) return { error: "no asana token" };
  if (!user) return { error: "no user" };
  try {
    const tasks = await fetch(
      `https://app.asana.com/api/1.0/workspaces/${workspace}/tasks/search?resource_subtype=default_task&sort_by=modified_at&sort_ascending=falsetext=${randomWords.join(
        "%20"
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      }
    ).then((response) => response.json());
    return {
      fullData: tasks.data?.items,
      data:
        tasks.data?.items?.map(({ name, notes, permalink_url }) => ({
          title: name,
          body: notes,
          link: permalink_url,
        })) || [],
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to fetch data from Asana." };
  }
}

export default getAsana;
