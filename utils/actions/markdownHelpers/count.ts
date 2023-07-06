const countMarkdown = ({
  count,
  isPrivateRepo,
  repoName,
}: {
  count: any;
  isPrivateRepo: boolean;
  repoName: string;
}) => {
  let textToWrite = "";
  if (isPrivateRepo) {
    if (count.error) {
      textToWrite += `\n We're sorry, we ran into an error: ${count.error}`;
    } else {
      if (count.name && count.github_app_uses) {
        textToWrite += `\n Your team ${count.name} has used Watermelon ${count.github_app_uses} times.`;
      }
    }
  } else {
    textToWrite += `\n ${repoName} is an open repo and Watermelon will serve it for free.`;
    textToWrite += `\n 🍉🫶`;
  }
  return textToWrite;
};
export default countMarkdown;
