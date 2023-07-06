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
  } else {
    markdown += `Linear Tickets deactivated by ${userLogin}`;

    markdown += `\n`;
  }
  return markdown;
};
