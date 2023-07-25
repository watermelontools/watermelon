const notionMarkdown = ({
  NotionPages,
  notionValue,
  userLogin,
}: {
  NotionPages: number;
  notionValue: any;
  userLogin: string;
}) => {
  let markdown = `\n ### Notion Pages`;

  if (NotionPages) {
    if (notionValue?.error === "no notion token") {
      markdown += `\n [Click here to login to Notion](https://app.watermelontools.com)`;
    } else {
      if (notionValue?.length) {
        for (let index = 0; index < notionValue.length; index++) {
          const element = notionValue[index];
          markdown += `\n - [${
            element?.icon?.type === "external"
              ? `<img src="${element?.icon?.external.url}" alt="Page icon" width="20" height="20" />`
              : element?.icon?.type === "emoji"
              ? `<img src="${element?.icon?.emoji}" alt="Page icon" width="20" height="20" />`
              : ""
          } ${element.properties.title.title.plain_text}](${element.url}) \n`;
        }
      } else {
        markdown += `\n No results found :(`;
      }
    }
  } else {
    markdown += `Notion Pages deactivated by ${userLogin} \n`;
  }
  return markdown;
};
export default notionMarkdown;
