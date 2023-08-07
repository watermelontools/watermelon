# Watermelontools App

<img src="public/logos/watermelon.png" alt="Watermelon Logo" width="350" height="200">

Welcome to Watermelon 🍉!

We help developers land better PRs by giving them code context.

## Our services

We can connect to:

<ul>
  <li>
    <strong>Git Platforms</strong>
    <ul>
      <li>
        <img src="public/logos/github.svg" alt="GitHub Logo" width="20" height="20"> GitHub
      </li>
      <li>
        <img src="public/logos/gitlab.svg" alt="GitLab Logo" width="20" height="20"> GitLab
      </li>
      <li>
        <img src="public/logos/bitbucket.svg" alt="Bitbucket Logo" width="20" height="20"> Bitbucket
      </li>
    </ul>
  </li>
  <li>
    <strong>Ticketing</strong>
    <ul>
      <li>
        <img src="public/logos/jira.svg" alt="Jira Logo" width="20" height="20"> Jira
      </li>
    </ul>
  </li>
  <li>
    <strong>Documentation</strong>
    <ul>
      <li>
        <img src="public/logos/confluence.svg" alt="Confluence Logo" width="20" height="20"> Confluence
      </li>
      <li>
        <img src="public/logos/notion.svg" alt="Notion Logo" width="20" height="20"> Notion
      </li>
    </ul>
  </li>
  <li>
    <strong>Messaging</strong>
    <ul>
      <li>
        <img src="public/logos/slack.svg" alt="Slack Logo" width="20" height="20"> Slack
      </li>
    </ul>
  </li>
</ul>

To start developing, clone and:

```
yarn
yarn dev
```

Or with npm

```
npm i
npm run dev
```

Or with npm

```
npm i
npm run dev
```

(Check your node version, we recommend 18)

We use a recent version of Next. You may refer to the documentation at https://nextjs.org/docs/.

This repo is automatically deployed on vercel to [app.watermelontools.com](app.watermelontools.com) on merges to `main`.

All the backend lives as serverless functions under `api`, with the route being the filename.

We now use the new app router for some features.

We now use the new app router for some features.

As we now use OAuth2.0, local development cannot be done on new integrations.

All environment vars are on vercel, the committer is responsible for correct deployments.

## Contributing

We develop with a model that forces a lot of things to be done by the developer. As this is a monorepo you have to be very careful.

_PLEASE READ [THE DOCS FOLDER](/docs/)_

### APIs

We have a `utils` folder that includes all the business logic. We have an `api` folder that handles web communication as dictated by NextJS. In the `types` folder we hold our typescript types, that should (roughly) match what our database has.

The developer has to match the `utils` folder structure to the `api` route schema. This makes it easier to maintain.

> As an example, we have `utils/user/getProfile.ts` that is imported in `pages/api/user/getProfile.ts` and returns a `types/UserProfile.ts`. In the database, you will find a _user_ table with all the data on the type.

We do all of this as a security measure. We don't want data exposed and we consider our backend safe.

### New integrations

To integrate a new service, several steps are to be taken, but it's pretty much copying code.

First, we use oauth so you need to ensure that the service supports it.

Remember that there are several procedures in our db to replicate.
