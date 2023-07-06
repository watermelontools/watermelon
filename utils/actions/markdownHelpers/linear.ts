const linearMarkdown = ({
  LinearTickets,
  linearValue,
  userLogin,
}: {
  LinearTickets: number;
  linearValue: any;
  userLogin: string;
}) => {
  let markdown = "";
  markdown += `\n`;
  markdown += "### Linear Tickets";
  markdown += `\n`;

  if (LinearTickets) {
    if (linearValue?.error === "no linear token") {
      markdown += `\n [Click here to login to Linear](https://app.watermelontools.com)`;
    } else {
    }
  } else {
    markdown += `Linear Tickets deactivated by ${userLogin}`;

    markdown += `\n`;
  }
  return markdown;
};
