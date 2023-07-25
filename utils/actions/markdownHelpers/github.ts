const githubMarkdown = ({
  GitHubPRs,
  ghValue,
  userLogin,
}: {
  GitHubPRs: number;
  ghValue: any;
  userLogin: string;
}) => {
  let markdown = `\n ### GitHub PRs`;
  if (GitHubPRs) {
    if (!Array.isArray(ghValue) && ghValue?.error === "no github token") {
      markdown += `\n No results found :(`;
    } else if (Array.isArray(ghValue) && ghValue?.length) {
      for (let index = 0; index < ghValue?.length; index++) {
        const element = ghValue[index];
        markdown += `\n - [#${element.number} - ${element.title}](${element.html_url})`;
        markdown += `\n`;
      }
    }
  } else {
    markdown += `GitHub PRs deactivated by ${userLogin} \n`;
  }
  return markdown;
};
export default githubMarkdown;
