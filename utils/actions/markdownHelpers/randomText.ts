const randomText = () => {
  const textList = [
    "\n[Why not invite more people to your team?](https://app.watermelontools.com/team)",
    "\n[Have you starred Watermelon?](https://github.com/watermelontools/watermelon)",
    "\n[Follow us Watermelon on 𝕏!](https://x.com/watermelontools)",
    "\n[Have you checked out our blog?](https://watermelontools.com/blog)",
    "\n[We are also on LinkedIn](https://www.linkedin.com/company/watermelon-tools)",
  ];

  let randomChance = Math.random() * 100;
  if (randomChance < 50) {
    return textList[Math.floor(Math.random() * textList.length)];
  }
  return "";
};
export default randomText;
