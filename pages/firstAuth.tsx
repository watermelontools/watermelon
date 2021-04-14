import { useEffect } from "react";
import { useRouter } from "next/router";
import PageTitle from "../components/PageTitle";

const FirstAuth = ({ firebaseApp, token }) => {
  const router = useRouter();
  let db = firebaseApp.firestore();
  token = token ?? JSON.parse(window.localStorage.getItem("sign_in_token"))
  const saveToken = () => {
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          sign_in_token: token,
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          installation: {
            teamId: token.team.id,
            userToken: token.authed_user.access_token,
            userId: token.authed_user.id,
          },
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };
  useEffect(() => {
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
    db.collection("teams")
      .doc(token.team.id)
      .get()
      .then((res) => {
        if (res.exists) {
          let responseData = res.data();
          window.localStorage.setItem(
            "add_to_slack_token",
            JSON.stringify(responseData.add_to_slack_token)
          );
          router.push("/wizard");
        } else saveToken();
      });
  }, []);
  return (
    <>
      <PageTitle pageTitle="Welcome to Watermelon!" />
      <div className="grid-rows-2">
        <div className="row-start-1 row-end-2 bg-pink-600 w-full"></div>
        <div className="row-start-2 row-end-3 white w-full"></div>
        <div className="flex justify-center items-center h-screen w-full row-span-full">
          <div className="rounded shadow p-4">
            <p>Please install the app on your workspace</p>
            <div className="w-full flex justify-center items-center my-2">
              {token && <a
                href={`https://slack.com/oauth/v2/authorize?team=${token.team.id
                  }&scope=incoming-webhook,groups:write,channels:manage,channels:read,chat:write,commands,chat:write.public&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID
                  }&redirect_uri=https://${process.env.NEXT_PUBLIC_IS_DEV ? "dev." : ""
                  }app.watermelon.tools/wizard`}
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
    </>
  );
};
export default FirstAuth;

import * as admin from 'firebase-admin';

export async function getServerSideProps(context) {
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV ? "dev." : ""
    }app.watermelon.tools/firstAuth`
  );
  let data = await f.json();
  let token = {
    team: data.team,
    app_id: data.app_id,
    authed_user: {
      id: data.authed_user.id,
      scope: data.authed_user.scope
    },
    enterprise: data.enterprise,
    is_enterprise_install: data.is_enterprise_install
  }
  const serviceAccount = {
    type: "service_account",
    project_id: "wm-dev-6e6a9",
    private_key_id: "c640727dd417a987ea78705f115f38d59f4a0bf8",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDKZKSy1nGMb+IE\nBP52i2ODZ7i8uSJeF/TU6gjsJMPK9qzLeWIpF42BBUOa/XJoK6QaGF9Gzc5HBGXw\nwMQUXX0l0YW45DAG2Hbz6bzOKuilU0oOnZELGFHnNvqHBd43PSA7hR2gDGRvYu7m\nVkm9QyLzSeTeQtTjQWluJIVCCcx+B1pZNrY7BYTVCpHWBmasGc5p3qDZsSz8m+D7\nb6HRB87uMBMdwQAqk0qEmUwQD73Dz8JQaPpb2FuSakCeQWWwBjzaN3760TtFjbAm\nU/omSRFWbR/oCt86+EnaAoz32z38VVHiBCRBc0MAY1RrQC1ehfwtZN9WMuOPCoWX\npX7XGTSPAgMBAAECggEAPX3BemJj4la11SHNTCgCZpCzVIdtFShzJuMqLdDnubkj\ne7iX5cM1p175kNPzGAo2VAVWoTTzOKlx7WkrycIzvTNAzRFrNBE9ZtL7nan0wBIj\nnHgr8rKDY9vU1wQl5SOJsPu7Kf7J3vuweMP7qGiG7GLlic/FTXx4s1GeORewDRPV\nKxNJViaq0Y1WutcJJ/5FUIuqDjJNAbZCzDF6dF1xYi3/am3Gez0BpGulu/w4ZPkM\nQXWZE3nR7TqtiQX/VzzzS6dyHQo7fQuImJrSwteShpzzVe6407c5ztk9kwFfAqrT\nSUYy2KSqmSNry3CeZdKFIVGEQlk40aKE2qmC6zHWyQKBgQD0PtT1IN6GHRaf4j/U\n2VqXK3AirJpb3j9PeKS8HCR4sitjSnIxGJoX3yINNRfW0EntvFJg0LwLVa5OL3eR\n3QLmhy+OeYQDvb/v88O0lGyBkK752bljPotRKrZXSF8bg28U3ESeyMH3N8A9gf9A\n8Z4FPGb8TzXEdMQK9kTDW3F8dwKBgQDUIi4doKk8Vr1r/nZ2/ZL9lURvyoLBGUeZ\nQ6LOvwbqRGIcNcAoCIYVzy0foXQiJ56g3jKBVTqMM37B9a62yLEPIMHpNX/XLw1j\n/HGKAT/YH0ju2zsO/hcHe2m/2VJp8XeMLLRnsMSKKVVgeuXIenIKtFmvHOdQZdZc\nUwk/IObGqQKBgEfqrEfVOtBghkXjl4nzyfHTD3yWOAku4pNi4Zal7rM/OvlMdV0x\nckXvJJag+Hj+8ZW3qsXpEEWCIAXTgjCH1A/O5FjePNnhKD/eFdT5Ew3/bRYSXrzz\nMJBgtDn1DFQMmkuZI/dhA4PofYle2qrjufSuuWA3box/GS5lHxAqv7q3AoGBAJHk\nL/MQW1O0E/IBv1d2bXEZB0ga7nH/AM7XRVEK76aOASuFi/H8arr1EQN/9m7G8MGS\nDwoDo5BomfSrEs2CmMLetH2+3X0QTxVEuJFA6reoTHB5NdTJyuzKY6AdxiA2gRFW\nbXwihgi/BIil/QIzs9rIziUwq6UPZK16LhHMfuqBAoGAQIrBYCactqw0bBh8yFzj\ni4O8XZM6VST/0TUwqeuad1kbU0PYJwxlPwomDAtmJ+ayI01z/f8FMIU5qe2/T5AE\nI1EoT2Vr3pmKlJAu+0lSZ1BZR68mVR+0USVwfxC9WAAQrAXKxYq7kb50M/NdcGo6\nZecuEdfGxOUTX0sf6WUIKaM=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-rinna@wm-dev-6e6a9.iam.gserviceaccount.com",
    client_id: "102196220780488634530",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rinna%40wm-dev-6e6a9.iam.gserviceaccount.com"
  }
  let firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
  }, "firstAuth");
  let db = firebaseApp.firestore();
  db.collection("teams")
    .doc(token.team.id)
    .set(
      {
        installation: {
          user: {
            token: data.authed_user.access_token,
            scopes: data.authed_user.scope,
            id: data.authed_user.id,
          },
        },
      },
      { merge: true }
    )
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
  return {
    props: {
      token,
    }, // will be passed to the page component as props
  };
}
