import { useEffect, useState } from "react"
import Select from 'react-select';
import { useRouter } from "next/router";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Wizard = ({  }) => {
  const router = useRouter();
  const [lang, setLang] = useState("en")
  const [cat, setCat] = useState("hobbies")
  const [weekday, setWeekday] = useState("THU")
  const [hour, setHour] = useState(15)
  const [timezone, setTimezone ] = useState("")
  const [exampleQuestion, setExampleQuestion] = useState(1)

  useEffect(() => {
    setExampleQuestion(questions.findIndex(element => element.cat === cat && element.lang === lang))
  }, [lang, cat])
  const saveSettings = () => {
    let data ={
      signInToken: JSON.parse(window.localStorage.getItem("sign_in_token")),
      lang,
      cat, 
      weekday, 
      hour,
      isWizard: true
     }
     fetch("/api/saveSettings",{
       method: "POST",
       body:JSON.stringify(data)
     })
     .then(function (docRef) {
      router.push("/welcome");
    })
    .catch(function (error) {
      console.error("Error writing: ", error);
    });
  };
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
  const weekdayOpts =[
    {value:"MON", label:"Monday"},
    {value:"TUE", label:"Tuesday"},
    {value:"WED", label:"Wednesday"},
    {value:"THU", label:"Thursday"},
    {value:"FRI", label:"Friday"},
    {value:"SAT", label:"Saturday"},
  ]
  const hourOpts =[
    {value:7,label:'07:00'},
    {value:8,label:'08:00'},
    {value:9,label:'09:00'},
    {value:10,label:'10:00'},
    {value:11,label:'11:00'},
    {value:12,label:'12:00'},
    {value:13,label:'13:00'},
    {value:14,label:'14:00'},
    {value:15,label:'15:00'},
    {value:16,label:'16:00'},
    {value:17,label:'17:00'},
    {value:18,label:'18:00'},
  ]
  return (
    <>
      <PageTitle pageTitle="The finishing touches" />

    </>
  )
}

export default Wizard

import admin from '../utils/firebase/backend';
import logger from "../logger/logger";
import { createInitialGroups } from "./api/admin/slack/[teamId]/createinitialgroups";

export async function getServerSideProps(context) {

  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV === "true" ? "dev." : ""
    }app.watermelon.tools/wizard`
  );
  let token = await f.json();
  console.log(token)
  //createInitialGroups({token})
  if(token.ok){
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
      logger.info({message: "new-add-to-slack:", data: token.team});
    })
    .catch(function (error) {
      logger.error("Error adding document: ", error);
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
    .then(function () {
      logger.info({message:"new-installation:", data:token.team});
    })
    .catch(function (error) {
      logger.error("Error adding document: ", error);
    });

    const token_clone = Object.assign({}, token);
    console.log("sending token", token_clone)
    delete token_clone.access_token;
    return {
      props: {
        token:token_clone, 
        redirect: false
      }, // will be passed to the page component as props
    };
  }
  else{
    return {
      redirect: {
        destination: '/weeklyquestions',
        permanent: false,
      }, // will be passed to the page component as props
    };
  }
}
