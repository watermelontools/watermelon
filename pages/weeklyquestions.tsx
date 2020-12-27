import { useReducer } from "react"
const initialState = [
  { question: "Does pineapple go on pizza?", icebreaker: "Hey @bob, what about other fruits on pizza?", answers: ["Yes 🍍🍕", "NO!"] },
  { question: "Which is the best movie saga?", icebreaker: "Do you think @alice would be sorted into Griffyndor?", answers: ["Harry Potter", "Star Wars", "Lord of the Rings", "The Avengers"] },
]
function reducer(state, action) {
  switch (action.type) {
    case "add_question": {
      return [
        ...state,
        { question: "What would you like to ask?", icebreaker: "You may use @tag here to randomly select a user", answers: ["At least two answers", "Second answer"] },
      ]
    }
    case "add_answer": {
      let newQuestions = [...state]
      if (newQuestions[action.questionIndex].answers.length < 4)
        newQuestions[action.questionIndex].answers = [...newQuestions[action.questionIndex].answers, ""]
      return newQuestions
    }
    case "remove_answer": {
      let newQuestions = [...state]
      newQuestions[action.questionIndex].answers.splice(action.answerIndex, 1)
      return newQuestions
    }
    case "edit_title": {
      let newQuestions = [...state]
      newQuestions[action.questionIndex].title = action.titleText
      return newQuestions
    }
    case "edit_icebreaker": {
      let newQuestions = [...state]
      newQuestions[action.questionIndex].icebreaker = action.icebreakerText
      return newQuestions
    }
    default:
      throw new Error();
  }
}

function WeeklyQuestions() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <h1>Weekly Questions</h1>
      <p>We recommend having 3 questions per week.</p>
      <p>We allow minimum 2 questions and maximum 4, each varying between 2 and 4 answers.</p>
      <form>
        {state.map((question, index) =>
          <div className="my-1" key={index}>
            <div>
              <label className="w-full md:w-1/2 flex flex-col text-xl font-semibold">
                Title
              <input type="text" maxLength={140} value={question.question}
                  placeholder="The question that will be asked goes here, end it with a question mark"
                  onChange={e => { e.preventDefault(); dispatch({ type: "edit_title", titleText: e.target.value, questionIndex: index }) }}
                  className="border rounded border-gray-200 text-base font-normal ml-1" />
              </label>
            </div>
            <div>
              <label className="w-full md:w-1/2 flex flex-col text-xl font-semibold">
                Icebreaker
               <input type="text"
                  placeholder="This will be the first message in the created group, use @tag to select a random user to begin a conversation"
                  value={question.icebreaker}
                  onChange={e => { e.preventDefault(); dispatch({ type: "edit_icebreaker", icebreakerText: e.target.value, questionIndex: index }) }}
                  className="border rounded border-gray-200 text-base font-normal ml-1" />
              </label>
            </div>
            {question.answers.map((answer, jndex) =>
              <div key={"answer" + jndex}>
                <label className="flex flex-nowrap w-full m-1 items-center" >
                  {jndex + 1}.
                  <input type="text" maxLength={140}
                    placeholder="Keep answers short"
                    value={answer}
                    className="border rounded border-gray-200 mx-1 p-1" />
                  {question.answers.length > 1 && <button
                    onClick={e => { e.preventDefault(); dispatch({ type: "remove_answer", questionIndex: index, answerIndex: jndex }) }}
                    className="border-red-500 bg-red-100 text-white font-bold rounded-full border px-2"
                  >
                    -
                  </button>}
                </label>
              </div>
            )}
            {question.answers.length < 4 &&
              <div className="m-1">
                {question.answers.length + 1}.
                <button
                  onClick={(e) => { e.preventDefault(); dispatch({ type: "add_answer", questionIndex: index }) }}
                  className="border rounded border-green-500 bg-green-100 px-2">
                  Add answer
                </button>
              </div>
            }
          </div>
        )}
        <button className="border rounded border-red-500 bg-red-100 p-2">Add Question</button>
      </form>
    </div>
  )
}

export default WeeklyQuestions
