# Watermelon's Open Source Copilot For Code Review

> DEPRECATION NOTICE
> Watermelon will be sunsetting the service at the end of march. We apologize for any inconvenience. 

[![Report an issue](https://img.shields.io/badge/-Report%20an%20issue-critical)](https://github.com/watermelontools/watermelon/issues)

![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/m/watermelontools/watermelon?style=flat-square)
[![GitHub Repo stars](https://img.shields.io/github/stars/watermelontools/watermelon?style=flat-square)](https://github.com/watermelontools/watermelon/stargazers)
[![Contributors](https://img.shields.io/github/contributors/watermelontools/watermelon?style=flat-square)](https://github.com/watermelontools/watermelon/graphs/contributors)
![OSSF-Scorecard Score](https://img.shields.io/ossf-scorecard/github.com/watermelontools/watermelon?style=flat-square)
[![Twitter Follow](https://img.shields.io/twitter/follow/WatermelonTools?style=flat-square)](https://twitter.com/intent/follow?screen_name=WatermelonTools)
[![Discord](https://img.shields.io/discord/933846506438541492?style=flat-square)](https://discord.com/invite/H4AE6b9442)

**Watermelon is an Open Source Copilot For Code Review**. Our GitHub application allows developers to pre-review GitHub Pull Requests by tracing their code context and performing static code analysis. Using LLMs to detect errors, compare intent to implementation, and give the PR a first health check.

We've built a search algorithm that indexes the most relevant [code context](https://www.watermelontools.com/post/what-is-passive-code-documentation-why-is-it-hard-to-scale-what-to-do-about-it) for a given pull request.

## Integrations

We currently support the following integrations

| Git                                     | Project Management | Messaging | Documentation      |
| :-------------------------------------- | :----------------- | :-------- | :----------------- |
| GitHub                                  | Jira, Linear, Asana      | Slack     | Notion, Confluence |

## Features

Watermelon's GitHub application allows teams to contextualize pull requests with code context from different sources.
<img width="907" alt="contextualization" src="https://github.com/watermelontools/watermelon/assets/8325094/36816e03-869f-4f2d-9ce6-115ce9c52a01">

Our GitHub application also identifies errors in your codebase. Beginning with the detection of console logs (and their equivalents across various major programming languages), Watermelon comments PR line diffs whenever an error is detected. Expanded capabilities in identifying a broader range of errors soon.
<img width="797" alt="linediff" src="https://github.com/watermelontools/watermelon/assets/8325094/aba15b7e-f9a5-4e4a-86de-dfe04aac7551">


Finally, our GitHub app uses "LLMs as Reviewer Zero". Watermelon evaluates the traced code context against the intent of the Pull Request. Based on these insights, it labels them as "🍉 Safe To Merge", "👀 Take a Deeper Dive", or "🚨 Don't Merge".
<img width="777" alt="prereview" src="https://github.com/watermelontools/watermelon/assets/8325094/742191f1-3505-453e-bd47-f1f2dea545c8">

## Requirements

- Our GitHub Application works across all GitHub cloud offerings including Enterprise Cloud.

## Installation

You can install Watermelon's GitHub Application [directly from the marketplace](https://github.com/marketplace/watermelon-context).

## Contributing

Check out [Contributing.md](CONTRIBUTING.md) and be aware of the [Code of Conduct](CODE_OF_CONDUCT.md)!

We're an early-stage project, therefore we still have the luxury to coordinate via short chats with our contributors. If you're interested in contributing, please join our [Discord](https://discord.com/invite/H4AE6b9442) community.
Alternatively, comment on our issues if you plan to solve one.

[![Report an issue](https://img.shields.io/badge/-Report%20an%20issue-critical)](https://github.com/watermelontools/watermelon/issues)

## Privacy

We use [PostHog Analytics](https://posthog.com/) to track how users interact with Watermelon's GitHub Application.

Watermelon [doesn't store your code](https://www.watermelontools.com/post/building-a-code-archeology-toolbox-without-storing-your-code)

---

#### About Watermelon

Watermelon is built by a globally distributed team of developers devoted to making software development easier. Join our [Discord](https://discord.com/invite/H4AE6b9442) community, follow us on [Twitter](https://twitter.com/WatermelonTools), and go to the [Watermelon blog](https://watermelontools.com/blog) to get the best programming tips.

### License

- [Apache License](LICENSE)
