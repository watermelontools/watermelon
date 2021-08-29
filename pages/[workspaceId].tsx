import Link from "next/link";
import PageTitle from "../components/PageTitle";
import PagePadder from "../components/PagePadder";
import { useEffect } from "react";
import { findWorkspaceForLogin } from "../utils/airtable/backend";

function HomePage({ token }) {
    useEffect(() => {
        console.log(token)
        window.localStorage.setItem("sign_in_token", JSON.stringify(token));
    }, []);
    return (
        <>
            <PageTitle pageTitle="Welcome to Watermelon🍉!" />
            <PagePadder>
                <p>
                    Watermelon is the best way to connect your coworkers through shared
                    interests.
        </p>
                <p>You can change the language and question type over at <Link href="/settings"><a>Settings</a></Link></p>
                <p>You can view a selection of questions at <Link href="/weeklyQuestions"><a>Questions</a></Link></p>
                <p>(Coming soon)Understand your workspace</p>
            </PagePadder>
        </>
    );
}

export default HomePage;
export async function getServerSideProps(context) {
    const {
        query: { teamId },
    } = context.req;

    let found = await findWorkspaceForLogin({ workspaceId: teamId })
    return { props: { token: found[0].fields } }

}