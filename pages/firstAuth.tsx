import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageTitle from "../components/PageTitle";

const FirstAuth = ({ token }) => {
  useEffect(() => {
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
  }, []);

  return (
    <>
      <PageTitle pageTitle="Welcome to Watermelon!" />
      <div
        className="flex justify-center items-center h-screen w-full"
        style={{ backgroundImage: "url(bg-pink.png)", backgroundSize: "cover" }}>
        <div className="grid-rows-2">
          <div className="flex justify-center items-center h-screen w-full row-span-full">
            <div className="rounded shadow p-4 bg-white">
              <p>Please install the app on your workspace</p>
              <div className="w-full flex justify-center items-center my-2">
                {token && <a
                  href={`https://slack.com/oauth/v2/authorize${token?.team?.id ? "?team=" + token.team.id + "&" : "?"
                    }scope=incoming-webhook,groups:write,channels:manage,channels:read,chat:write,commands,chat:write.public,users.profile:read,users:read.email,users:read,groups:read
                    &client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}
                    &redirect_uri=https://${process.env.NEXT_PUBLIC_IS_DEV == "true" ? process.env.NEXT_PUBLIC_VERCEL_URL : "app.watermelon.tools"}/wizard`}
                >
                  <img
                    alt="Add to Slack"
                    height="40"
                    width="139"
                    src="https://platform.slack-edge.com/img/add_to_slack.png"
                    srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                  />
                </a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FirstAuth;

import { createAdmin, findWorkspaceForLogin, createWorkspace } from '../utils/airtable/backend'
import logger from "../logger/logger";

export async function getServerSideProps(context) {
  let f
  if (context.query.code)
    f = await fetch(
      `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
      }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
      }&redirect_uri=https://${process.env.IS_DEV == "true" ? process.env.NEXT_PUBLIC_VERCEL_URL : "app.watermelon.tools"}/firstAuth`
    )
  else return {
    props: {
      error: "no code"
    }
  }
  let data = await f.json();
  let teamId = data.team.id
  logger.info({ teamId })
  let found = await findWorkspaceForLogin({ workspaceId: teamId })
  if (found && found[0]) {
    return {
      redirect: {
        destination: `/${teamId}`,
        permanent: false,
      }
    }
  }
  else {
    const response = await fetch("https://slack.com/api/users.identity", {
      headers: {
        'Authorization': `Bearer ${data?.authed_user?.access_token}`
      },
    })
    const respJson = await response.json()
    let createdUser = await createAdmin({
      admin: {
        AdminId: respJson.user.id,
        Name: respJson.user.name,
        Token: data.authed_user.access_token,
        Scope: data.authed_user.scope,
        Email: respJson.user.email,
        Image1024: respJson.user.image_1024,
      }
    })
    await createWorkspace({
      workspace: {
        WorkspaceId: respJson.team.id,
        Name: respJson.team.name,
        HasPaid: true,
        Enterprise: data.enterprise,
        Admins: [createdUser[0].id],
        ImageOriginal: respJson.team.image_original,
        Domain: respJson.team.domain
      }
    })
    let token = createdUser[0].fields
    delete token.Token
    return { props: { token } }
  }
}
