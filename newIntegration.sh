#!/bin/bash

# Receive a "serviceName" parameter
serviceName=$1

# Create a folder with the serviceName under /app/(loggedIn)
mkdir -p ./app/\(loggedIn\)/${serviceName}

# Create a file "/app/(loggedIn)/${serviceName}/loading.tsx"
cat > ./app/\(loggedIn\)/${serviceName}/loading.tsx <<EOL
import LoadingConnectedService from "../../../components/services/loading";

export default function loadingConnectedService() {
  return <LoadingConnectedService />;
}
EOL

# Create a folder with the serviceName under /utils/db
mkdir -p ./utils/db/${serviceName}

# Create a file "saveUser.ts" in that folder
cat > ./utils/db/${serviceName}/saveUser.ts <<EOL
import executeRequest from "../azuredb";

export default async ({
  access_token,
  id,
  avatar_url,
  watermelon_user,
  refresh_token,
  workspace,
  name
}) => {
  let query = \`EXEC dbo.create_${serviceName} @watermelon_user='\${watermelon_user}', @id='\${id}',
 @avatar_url='\${avatar_url}', @name='\${name}', @access_token='\${access_token}', @refresh_token='\${refresh_token}',@workspace='\${workspace}';
 \`;
  let resp = await executeRequest(query);
  return resp;
};
EOL

# Create a file "/app/(loggedIn)/${serviceName}/page.tsx"
cat > ./app/\(loggedIn\)/${serviceName}/page.tsx <<EOL
import { getServerSession } from "next-auth";
//change this to import correctly
import saveUserInfo from "../../../utils/db/${serviceName}/saveUser";

import { authOptions } from "../../api/auth/[...nextauth]/route";
import getAllPublicUserData from "../../../utils/api/getAllUserPublicData";

import ConnectedService from "../../../components/services/page";
import LoginArray from "../../../components/services/loginArray";

export default async function ServicePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const userName = session?.user?.name;
  const { code, state } = searchParams;
  let error = "";
  // change service name
  const serviceName = "${serviceName}";
  const [userData, serviceToken] = await Promise.all([
    getAllPublicUserData({ email: userEmail }).catch((e) => {
      console.error(e);
      return null;
    }),
    // change this fetch
    fetch(\`SERVICE_OAUTH_URL\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "https://app.watermelontools.com/${serviceName}",
        client_id: process.env.SERVICE_APP_ID,
        client_secret: process.env.SERVICE_CLIENT_SECRET,
      }),
    }),
  ]);

  // the recommended services should not be of the same category as the current one
  const nameList = [];
  const loginArray = LoginArray({ nameList, userEmail, userData });

  const json = await serviceToken.json();
  if (json.error) {
    error = json.error;
  } else {
    // get user correctly
    let user = await fetch(\`YOUR_USER_API_LINK\`, {
      headers: {
        Authorization: \`Bearer \${json.access_token}\`,
      },
    });
    let userJson = await user.json();
    // save user correctly
    await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      scope: json.scope,
      username: userJson.username,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: state,
      name: userJson.name,
      organization: userJson.organization,
      website: userJson.website,
      email: userJson.email,
      location: userJson.location,
      bio: userJson.bio,
      twitter: userJson.twitter,
      linkedin: userJson.linkedin,
    });

    return (
      <ConnectedService
        serviceName={serviceName}
        displayName={userJson.username}
        teamName={userJson.organization}
        avatarUrl={userJson.avatar_url}
        loginArray={loginArray}
        error={error}
      />
    );
  }
}
EOL

# Create a file "/utils/actions/get${serviceName}.ts"
touch ./utils/actions/get${serviceName}.ts

echo "Files and directories created successfully!"
