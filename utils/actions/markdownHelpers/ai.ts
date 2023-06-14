const aiMarkdown = ({AISummary,aiValue, userLogin}: {AISummary: number;aiValue: any;userLogin: string;}) => {
    let
        markdown = "";
        
        let businessLogicSummary;
        if (AISummary) {
          console.log("getting AISummary", AISummary);
          businessLogicSummary = await getOpenAISummary({
            ghValue,
            commitList,
            jiraValue,
            slackValue,
            title,
            body,
          });

          if (businessLogicSummary) {
            console.log("businessLogicSummary", businessLogicSummary);
            textToWrite += businessLogicSummary;
          } else {
            textToWrite += "Error getting summary" + businessLogicSummary.error;
          }
        } else {
          textToWrite += `AI Summary deactivated by ${pull_request.user.login}`;
        }
