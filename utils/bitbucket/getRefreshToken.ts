export default async ({ code }) => {
    try {
        let response = await fetch(
        "https://bitbucket.org/site/oauth2/access_token",
        {
            method: "POST",
            headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&code=${code}`,
        }
        );
        let data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
