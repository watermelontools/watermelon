const countMarkdown = ({
  count,
  isPrivateRepo,
  repoName,
}: {
  count: any;
  isPrivateRepo: boolean;
  repoName: string;
}) => {
  if (isPrivateRepo) {
    if (count.error) {
      return `\n We're sorry, we ran into an error: ${count.error}`;
    } else {
      if (count.name && (count.github_app_uses <= 500)) {
        return `\n Your team ${count.name} has used Watermelon ${count.github_app_uses} times.`;
      } else {
        return `\n Your team has surpassed the free monthly usage. [Please click here](https://calendly.com/evargas-14/watermelon-business) to upgrade.`;
      }
    }
  } else {
    return `\n ${repoName} is an open repo and Watermelon will serve it for free.
    🍉🫶`;
  }
};
export default countMarkdown;
