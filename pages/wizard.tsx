import { useEffect, useState } from "react"

const Wizard = () => {
  const [lang, setLang] = useState("en")
  const [cat, setCat] = useState("hobbies")
  const [exampleQuestion, setExampleQuestion] = useState(1)

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
  return (
    <div className="flex justify-center items-center h-screen w-full flex-col">
      <h1>The finishing touches:</h1>
      <div className="flex">
        <div>
          <h2>Language</h2>
          <p>Select the language in which the questions will be sent:</p>
          <p>This dashboard will stay in English</p>
          <select onChange={e => setLang(e.target.value)}>
            <option value={"en"}>English</option>
            <option value={"es"}>Español</option>
          </select>
        </div>
        <div>
          <h2>Question Type</h2>
          <p>Select the category of the questions to be shown</p>
          <select onChange={e => setCat(e.target.value)}>
            <option value={"hobbies"}>Hobbies</option>
            <option value={"profDev"}>Professional Development</option>
          </select>
        </div>
      </div>
      <div>
        <p className="font-bold">{questions[exampleQuestion].question}</p>
        <div className="flex justify-start my-1">
        <p className="border border-gray-200 rounded px-2 py-1 mr-2 hover:bg-gray-100">{questions[exampleQuestion].ansA}</p>
        <p className="border border-gray-200 rounded px-2 py-1 hover:bg-gray-100">{questions[exampleQuestion].ansB}</p>
        </div>
        <p>{questions[exampleQuestion].icebreaker}</p>
      </div>
    </div>
  )
}

export default Wizard