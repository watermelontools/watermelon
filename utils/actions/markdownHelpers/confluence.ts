const confluenceMarkdown = ({
  ConfluenceDocs,
  confluenceValue,
  userLogin,
}: {
  ConfluenceDocs: number;
  confluenceValue: any;
  userLogin: string;
}) => {
  let markdown = "";
  markdown += `\n`;
  markdown += "### Confluence Docs";
  if (ConfluenceDocs) {
    if (
      !Array.isArray(confluenceValue) &&
      confluenceValue?.error === "no confluence token"
    ) {
      markdown = `\n [Click here to login to Confluence](https://app.watermelontools.com)`;
    } else if (Array.isArray(confluenceValue)) {
      if (confluenceValue?.length) {
        for (let index = 0; index < confluenceValue.length; index++) {
          const element = confluenceValue[index];
          markdown += `\n - [#${element.title}\n ${
            element.excerpt.length > 100
              ? element.excerpt.substring(0, 100) + "..."
              : element.excerpt
          }](${element.content._links.self.split("/rest")[0]})${
            element.content._links.webui
          }`;
          markdown += `\n`;
        }
      } else {
        markdown += `\n No results found :(`;
      }
    }
  } else {
    markdown += `Confluence Docs deactivated by ${userLogin}`;
    markdown += `\n`;
  }
  return markdown;
};
export default confluenceMarkdown;
