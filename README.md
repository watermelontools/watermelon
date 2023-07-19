# Watermelon.tools

```
yarn
yarn dev
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
