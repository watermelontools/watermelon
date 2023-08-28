# Contributing

We discuss both on GitHub Issues and [Discord](discord.gg/H4AE6b9442).

## Contributing to Watermelon's Passive Documentation Search Engine

Anyone is free to contribute changes to any file in this repository. You don't need to ask for permission or get in line. If you see an issue that's open and it seems interesting to you, feel free to pick it up. Your solution may be better. Open-source is beautiful.

> Exception: If your contribution makes [paid Watermelon feature](https://watermelontools.com/pricing/) available for free, we are unlikely to accept it. Consult us beforehand for a definitive answer.

## Running the Passive Documentation Search Engine Locally

To start developing, clone and:

```bash
yarn
yarn dev
```

Or with npm

```bash
npm i
npm run dev
```

Or with npm

(Check your node version, we recommend 18)

We use a recent version of Next. You may refer to the documentation at https://nextjs.org/docs/.

This repo is automatically deployed on vercel to [app.watermelontools.com](app.watermelontools.com) on merges to `main`.

All the backend lives as serverless functions under `api`, with the route being the filename.

We now use the new app router for some features.

As we now use OAuth2.0, local development cannot be done on new integrations.

All environment vars are on vercel, the committer is responsible for correct deployments.

## Getting started

We develop with a model that forces a lot of things to be done by the developer. As this is a monorepo you have to be very careful.

_PLEASE READ [THE DOCS FOLDER](/docs/)_

_PLEASE READ THE [CODE OF CONDUCT](CODE_OF_CONDUCT.md)_

### APIs

We have a `utils` folder that includes all the business logic. We have an `api` folder that handles web communication as dictated by NextJS. In the `types` folder we hold our typescript types, that should (roughly) match what our database has.

The developer has to match the `utils` folder structure to the `api` route schema. This makes it easier to maintain.

> As an example, we have `utils/user/getProfile.ts` that is imported in `pages/api/user/getProfile.ts` and returns a `types/UserProfile.ts`. In the database, you will find a _user_ table with all the data on the type.

We do all of this as a security measure. We don't want data exposed and we consider our backend safe.

### New integrations

To integrate a new service, several steps are to be taken, but it's pretty much copying code.

First, we use oauth so you need to ensure that the service supports it.

Remember that there are several procedures in our db to replicate.

The steps to do so are:

- Set the necesary vercel env vars
  > usually `SERVICE_CLIENT_SECRET` and `SERVICE_CLIENT_ID`
- Create the table in our DB

  > **This is sketch of a possible new table**
  >
  > _Add any other required columns as needed_

```sql
CREATE TABLE serviceName (
   id INT PRIMARY KEY,
   name VARCHAR(255),
   email VARCHAR(255),
   updated_at DATETIME DEFAULT GETDATE() NOT NULL,
   created_at DATETIME DEFAULT GETDATE() NOT NULL,
   access_token VARCHAR(255),
   refresh_token VARCHAR(255),
   avatar_url VARCHAR(255),
   workspace VARCHAR(255),
   workspace_image VARCHAR(255),
   watermelon_user VARCHAR(255),
   deleted BIT DEFAULT 0 NULL,
   deleted_at DATETIME DEFAULT GETDATE() NULL,
   FOREIGN KEY (watermelon_user) REFERENCES watermelon.dbo.users(id)
   );
```

- Edit the userSettings table

  ```sql
  ALTER TABLE userSettings ADD ServiceReadableName INT DEFAULT 3;`
  ```

  ```sql
  UPDATE userSettings SET ServiceReadableName = 3 WHERE ServiceReadableName IS NULL;
  ```

- Create the necessary procedures
  - Setting the information for the user
  - Fetching the settings
  - Fetching the tokens
- Create a `ServiceLoginLink.ts` component in the `components` folder
- Add the service to the `loginArray.tsx` file
- Add the service to the `loginGrid.tsx` file in the correct section
- Add the service to `form.tsx` under _settings_

Run the `newIntegration.sh` script which will

- Create the service folder under `(loggedIn)`
- Copy the `loading.tsx` from any other service
- Create the function under `/utils/db/service/saveUser` that you need to complete
- Populate the `page.tsx` file to be finished the correct service parameters
- Create an empty getter in `/utils/actions`

## Issues

If there's something you'd like to see please [open an issue](https://github.com/watermelontools/watermelon/issues/new).

## PRs

We love community contributions. Please fork the repo and send a PR our way.

Remember, we'll discuss it publicly, it's a great opportunity to learn.

### Resources

####

- [Octokit (SDK for GitHub)](https://octokit.github.io/)
