import { useEffect, useState } from "react"
import Select from 'react-select';
import { useRouter } from "next/router";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Wizard = ({firebaseApp, token}) => {
  const [lang, setLang] = useState("en")
  const [cat, setCat] = useState("hobbies")
  const [exampleQuestion, setExampleQuestion] = useState(1)
  const router = useRouter();
  let db = firebaseApp.firestore();
  let signInToken = {team: {id:""}}
  useEffect(()=>{
    signInToken=JSON.parse(window.localStorage.getItem("sign_in_token"))
  })
  const saveSettings = () => {
    let db = firebaseApp.firestore();
      db.collection("teams")
        .doc(
          `${signInToken.team
            .id
          }`
        )
        .set({ settings: {language: lang, category: cat} }, { merge: true })
        .then(function (docRef) {
          console.log("Wrote to db", docRef);
          router.push("/welcome");
        })
        .catch(function (error) {
          console.error("Error writing: ", error);
        });
      
  };
  useEffect(() => {
    window.localStorage.setItem("add_to_slack_token", JSON.stringify(token));
  }, []);
  useEffect(() => {
    setExampleQuestion(questions.findIndex(element => element.cat === cat && element.lang === lang))
  }, [lang, cat])
  const person = "{person}"
  const answer= "{answer}"
  const questions = [
    {
      question: "What do you value more in a workplace?",
      icebreaker: <>Hey <span title="These are variables that will be replaced when sent" className="text-green-400">${person}</span>, why do you value <span title="These are variables that will be replaced when sent" className="text-green-400">${answer}</span> so much?</>,
      ansA: "Risk-taking",
      ansB: "Being careful",
      cat: "profDev",
      lang: "en"
    },
    {
      question: "What do you prefer to read?",
      icebreaker: <>Hey <span title="These are variables that will be replaced when sent" className="text-green-400">${person}</span>, who's your favorite <span title="These are variables that will be replaced when sent" className="text-green-400">${answer}</span> author?</>,
      ansA: "Fiction",
      ansB: "Non-fiction",
      cat: "hobbies",
      lang: "en"
    },
    {
      question: "¿Qué prefieres leer?",
      icebreaker: <>¿<span title="These are variables that will be replaced when sent" className="text-green-400">${person}</span>, quien es tu autor favorito de <span title="These are variables that will be replaced when sent" className="text-green-400">${answer}</span>?</>,
      ansA: "Ficción",
      ansB: "No ficción",
      cat: "hobbies",
      lang: "es"
    },
    {
      question: "¿En qué habilidad blanda te gustaría recibir capacitación?",
      icebreaker: <>¿<span title="These are variables that will be replaced when sent" className="text-green-400">${person}</span>, por qué te gustaría saber más sobre <span title="These are variables that will be replaced when sent" className="text-green-400">${answer}</span>?</>,
      ansA: "Hablar en público",
      ansB: "Toma de decisiones",
      cat: "profDev",
      lang: "es"
    },
  ]
  const langOpts = [
   { value:"en", label:"English"},
   { value:"es", label:"Español"},
  ]

  const catOpts =[
    {value:"hobbies", label:"Hobbies"},
    {value:"profDev", label:"Professional Development"},
  ]
  return (
    <>
      <PageTitle pageTitle="The finishing touches" />
      <PagePadder>
      <div className="flex justify-start items-start h-screen w-full flex-col flex-wrap">
        <div className="flex sm:flex-col md:flex-row">
          <div className="card-style flex flex-col justify-between w-80">
            <h2 className="font-bold text-xl">Language</h2>
            <p>Select the language in which the questions will be sent:</p>
            <p>This dashboard will stay in English</p>
            <Select onChange={e => setLang(e.value)} value={langOpts.find(el=> el.value=== lang)} options={langOpts} />
          </div>
          <div className="card-style flex flex-col justify-between w-80">
            <div>

            <h2 className="font-bold text-xl">Question Type</h2>
            <p>Select the category of the questions to be shown</p>
            </div>
            <Select onChange={e => setCat(e.value)} value={catOpts.find(el=> el.value=== cat)} options={catOpts} />
          </div>
        </div>
        <div className="flex hover:bg-gray-50 border-gray-200 border-t-2 w-full mt-2">
          <div className="rounded mx-2" style={{width: "3em", height: "3em"}}>
          <img src="/wmslack.png" />
          </div>
          <div>
            <div className="flex">

          <p className="font-bold text-lg">Watermelon</p>
          <div className="flex-col flex justify-center">

          <p className="bg-gray-200 rounded-sm text-xs ml-2 px-1 text-gray-500 leading-1">APP</p>
          </div>
            </div>
          <p className="font-semibold">{questions[exampleQuestion].question}</p>
          <div className="flex justify-start my-1">
          <p className="border border-gray-200 rounded px-2 py-1 mr-2 hover:bg-gray-100">{questions[exampleQuestion].ansA}</p>
          <p className="border border-gray-200 rounded px-2 py-1 hover:bg-gray-100">{questions[exampleQuestion].ansB}</p>
          </div>
          <p>{questions[exampleQuestion].icebreaker}</p>
          </div>
        </div>
        <div className="my-2 flex justify-end w-full">
         <button onClick={(e)=> saveSettings()} className="text-white font-semibold bg-green-400 rounded shadow-sm py-2 px-3">
           Finish
         </button>
       </div>
      </div>
      </PagePadder>
    </>
  )
}

export default Wizard

import * as admin from 'firebase-admin';

export async function getServerSideProps(context) {
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
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV ? "dev." : ""
    }app.watermelon.tools/wizard`
  );
  let token = await f.json();
  let firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any)
  });
  let db = firebaseApp.firestore();
  db.collection("teams")
  .doc(token.team.id)
  .set(
    {
      add_to_slack_token: token,
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
        team: token.team,
        enterprise: token.enterprise ?? false,
        tokenType: "bot",
        isEnterpriseInstall: token.is_enterprise_install ?? false,
        appId: token.app_id,
        authVersion: "v2",
        bot: {
          scopes: token.scope.split(","),
          token: token.access_token,
          userId: token.bot_user_id,
          id: token.incoming_webhook.channel_id,
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
  const token_clone = Object.assign({}, token);
  delete token_clone.access_token;
  return {
    props: {
      token:token_clone
    }, // will be passed to the page component as props
  };
}
