const randomText = () => {
  const textList = [
    "\n[Why not invite more people to your team?](https://app.watermelontools.com/team)",
    "\n[Have you starred Watermelon?](https://github.com/watermelontools/watermelon)",
  ];

  let randomChance = Math.random() * 100;
  if (randomChance < 50) {
    return textList[Math.floor(Math.random() * textList.length)];
  }
  return "";
};
export default randomText;
