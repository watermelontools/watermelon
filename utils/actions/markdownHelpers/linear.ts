const linearMarkdown = ({
  LinearTickets,
  linearValue,
  userLogin,
}: {
  LinearTickets: number;
  linearValue: any;
  userLogin: string;
}) => {
  let markdown = `\n ### Linear Tickets`;

  if (LinearTickets) {
    if (linearValue?.error === "no linear token") {
      markdown = `\n [Click here to login to Linear](https://app.watermelontools.com)`;
    } else {
      if (linearValue.length) {
        for (let index = 0; index < linearValue.length; index++) {
          const element = linearValue[index];
          markdown += `\n - [${element.number} - ${element.title}](${element.url}) \n`;
        }
      } else {
        markdown += `\n No results found :(`;
      }
    }
  } else {
    markdown += `Linear Tickets deactivated by ${userLogin} \n`;
  }
  return markdown;
};
export default linearMarkdown;
