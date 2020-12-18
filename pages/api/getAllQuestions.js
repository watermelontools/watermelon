const { App } = require('@slack/bolt');
// require('dotenv').config();
// const store = require('./store');

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


// To simplify dealing with Firestore, deploy this to cloud functions


// For MVP hardcode questions here. In the future, retrieve questions
app.event('app_home_opened', ({ event, say }) => {
  say(`Hello, <@${event.user}>! Time to answer 3 quick questions for this week's water-cooler.`);
  say({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Pending Change",
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "covfefe"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "What's your favorite music genre?"
          },
          {
            "type": "mrkdwn",
            "text": "What's your favorite plan for the weekend?"
          },
          {
            "type": "mkrdwn",
            "text": "What game would you rather play?"
          }
        ]
      },
    ]
  })
})

// Start your app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡ Bolt app is running!');
})()
export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.send({
    "token": "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    "challenge": "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    "type": "url_verification"
  })
}
