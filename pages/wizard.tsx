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

import admin from '../utils/firebase/backend';

export async function getServerSideProps(context) {

  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV === "true" ? "dev." : ""
    }app.watermelon.tools/wizard`
  );
  let token = await f.json();
  console.log("cq",context.query)
console.log("token", token)
  let db = admin.firestore();
  await db.collection("teams")
  .doc(token.team.id)
  .set(
    {
      add_to_slack_token: token,
    },
    { merge: true }
  )
  .then(function (docRef) {
    console.log("New install:", token.team);
  })
  .catch(function (error) {
    console.error("Error adding document: ", error);
  });

  await db.collection("teams")
  .doc(token.team.id)
  .update(
    {
        "installation.team": token.team,
        "installation.enterprise": token.enterprise ?? false,
        "installation.tokenType": "bot",
        "installation.isEnterpriseInstall": token.is_enterprise_install ?? false,
        "installation.appId": token.app_id,
        "installation.authVersion": "v2",
        "installation.bot": {
          scopes: token.scope.split(","),
          token: token.access_token,
          userId: token.bot_user_id,
          id: token.incoming_webhook.channel_id,
        },
    }
  )
  .then(function (docRef) {
    console.log("New install:", token.team);
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
