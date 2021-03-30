import { useEffect, useState } from "react"

const Wizard = () => {
  const [lang, setLang] = useState("en")
  const [cat, setCat] = useState("hobbies")
  const [exampleQuestion, setExampleQuestion] = useState(1)

  useEffect(() => {
    setExampleQuestion(questions.findIndex(element => element.cat === cat && element.lang === lang))
  }, [lang, cat])
  const questions = [
    {
      question: "What do you value more in a workplace?",
      icebreaker: "Hey ${person}, why do you value ${answer} so much?",
      ansA: "Risk-taking",
      ansB: "Being careful",
      cat: "profDev",
      lang: "en"
    },
    {
      question: "What do you prefer to read?",
      icebreaker: "Hey ${person}, who's your favorite ${answer} author?",
      ansA: "Fiction",
      ansB: "Non-fiction",
      cat: "hobbies",
      lang: "en"
    },
    {
      question: "¿Qué prefieres leer?",
      icebreaker: "¿${person}, quien es tu autor favorito de ${answer}?",
      ansA: "Ficción",
      ansB: "No ficción",
      cat: "hobbies",
      lang: "es"
    },
    {
      question: "¿En qué habilidad blanda te gustaría recibir capacitación?",
      icebreaker: "¿${person}, por qué te gustaría saber más sobre ${answer}?",
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
        <p>{questions[exampleQuestion].question}</p>
        <p>{questions[exampleQuestion].icebreaker}</p>
        <p>{questions[exampleQuestion].ansA}</p>
        <p>{questions[exampleQuestion].ansB}</p>
      </div>
    </div>
  )
}

export default Wizard