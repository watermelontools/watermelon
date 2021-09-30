import logger from "../../../../logger/logger";

export default async function handler(req, res) {
    logger.info({source: "SLASH_COMMAND-HELP", params:req.body})
    res.status(200).json({
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Welcome to Watermelon :watermelon:!",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Your questions will be sent weekly and 24 hours later groups will be created. For help email us at <mailto:support@watermelon.tools|support@watermelon.tools>"
			}
		}
	]
});
}
