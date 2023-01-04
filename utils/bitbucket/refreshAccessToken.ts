export default async ({ refresh_token }) => {
    try {
        let response = await fetch(
        "https://bitbucket.org/site/oauth2/access_token",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
        }
        );
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
