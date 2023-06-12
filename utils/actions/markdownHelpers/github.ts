const githubMarkdown = ({ ghValue }: { ghValue: any }) => {
  let markdown = "";

  if (!Array.isArray(ghValue) || !ghValue?.length) {
    markdown += `\n No results found :( \n`;
  } else {
    for (let index = 0; index < ghValue?.length; index++) {
      const element = ghValue[index];
      markdown += `\n [#${element.number} - ${element.title}](${element.html_url}) \n`;
    }
  }

  return markdown;
};
