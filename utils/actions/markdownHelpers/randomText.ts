const randomText = () => {
  const textList = [
    "\n[Why not invite more people to your team?](https://app.watermelontools.com/team)",
    "\n[Have you starred Watermelon?](https://github.com/watermelontools/watermelon)",
    "\n[Try us on VSCode!](https://marketplace.visualstudio.com/items?itemName=WatermelonTools.watermelon-tools)",
    "\n[Try us on VSCodium!](https://open-vsx.org/extension/WatermelonTools/watermelon-tools)",
    "\n[Try us on any JetBrains IDE!](https://plugins.jetbrains.com/plugin/22720-watermelon-context)",
  ];

  let randomChance = Math.random() * 100;
  if (randomChance < 50) {
    return textList[Math.floor(Math.random() * textList.length)];
  }
  return "";
};
export default randomText;
