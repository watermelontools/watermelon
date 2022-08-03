# Watermelon.tools

```
yarn
yarn dev
```

We use a recent version of Next. You may refer to the documentation at https://nextjs.org/docs/.

This repo is automatically deployed on vercel to [app.watermelon.tools](app.watermelon.tools) on merges to ```main```.

All the backend lives as serverless functions under `api`, with the route being the filename.

As we now use OAuth2.0, local development cannot be done.

All environment vars are on vercel, the committer is responsible for correct deployments.
