import { useReducer } from "react";

const initialState = [
  {
    question: "Does pineapple go on pizza?",
    icebreaker: "Hey @bob, what about other fruits on pizza?",
    answers: ["Yes 🍍🍕", "NO!"],
  },
  {
    question: "Which is the best movie saga?",
    icebreaker: "Do you think @alice would be sorted into Griffyndor?",
    answers: ["Harry Potter", "Star Wars", "Lord of the Rings", "The Avengers"],
  },
];
const reducer = (state, action) => {
  switch (action.type) {
    case "add_question": {
      return [
        ...state,
        {
          question: "What would you like to ask?",
          icebreaker: "You may use @tag here to randomly select a user",
          answers: ["At least two answers", "Second answer"],
        },
      ];
    }
    case "delete_question": {
      let newQuestions = [...state];
      newQuestions.splice(action.questionIndex, 1);
      return newQuestions;
    }
    case "add_answer": {
      let newQuestions = [...state];
      if (newQuestions[action.questionIndex].answers.length < 4)
        newQuestions[action.questionIndex].answers = [
          ...newQuestions[action.questionIndex].answers,
          "",
        ];
      return newQuestions;
    }
    case "edit_answer": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].answers[action.answerIndex] =
        action.answerText;
      return newQuestions;
    }
    case "remove_answer": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].answers.splice(action.answerIndex, 1);
      return newQuestions;
    }
    case "edit_title": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].question = action.questionText;
      return newQuestions;
    }
    case "edit_icebreaker": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].icebreaker = action.icebreakerText;
      return newQuestions;
    }
    default:
      throw new Error();
  }
};
const WeeklyQuestions = ({ firebaseApp }) => {
  const saveQuestions = () => {
    let db = firebaseApp.firestore();
    db.collection("users")
      .doc("maria@lean-tech.io")
      .set(
        {
          weekly_questions: state,
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
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <h1>Weekly Questions</h1>
      <p>We recommend having 3 questions per week.</p>
      <p>
        We allow minimum 2 questions and maximum 4, each varying between 2 and 4
        answers.
      </p>
      <form className="flex flex-col md:flex-row w-full h-full items-end">
        <div className="w-full md:w-10/12">
          {state.map((question, index) => (
            <div className="my-2" key={index}>
              <div>
                <label className="w-full md:w-1/2 flex flex-col text-xl font-semibold">
                  <div className="flex justify-between my-1">
                    Question
                    {state.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch({
                            type: "delete_question",
                            questionIndex: index,
                          });
                        }}
                        className="bg-pink-200 text-red-500 w-24 rounded text-base"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    maxLength={140}
                    value={question.question}
                    placeholder="The question that will be asked goes here, end it with a question mark"
                    onChange={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: "edit_title",
                        questionText: e.target.value,
                        questionIndex: index,
                      });
                    }}
                    className="border rounded border-gray-200 text-base font-normal ml-1"
                  />
                </label>
              </div>
              <div>
                <label className="w-full md:w-1/2 flex flex-col text-xl font-semibold">
                  Icebreaker
                  <input
                    type="text"
                    placeholder="This will be the first message in the created group, use @tag to select a random user to begin a conversation"
                    value={question.icebreaker}
                    onChange={(e) => {
                      e.preventDefault();
                      dispatch({
                        type: "edit_icebreaker",
                        icebreakerText: e.target.value,
                        questionIndex: index,
                      });
                    }}
                    className="border rounded border-gray-200 text-base font-normal ml-1"
                  />
                </label>
              </div>
              {question.answers.map((answer, jndex) => (
                <div key={"answer" + jndex}>
                  <label className="flex flex-nowrap w-full m-1 items-center">
                    {jndex + 1}.
                    <input
                      type="text"
                      maxLength={140}
                      placeholder="Keep answers short"
                      value={answer}
                      onChange={(e) =>
                        dispatch({
                          type: "edit_answer",
                          questionIndex: index,
                          answerIndex: jndex,
                          answerText: e.target.value,
                        })
                      }
                      className="border rounded border-gray-200 mx-1 p-1"
                    />
                    {question.answers.length > 2 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch({
                            type: "remove_answer",
                            questionIndex: index,
                            answerIndex: jndex,
                          });
                        }}
                        className="bg-red-100 text-red-500 font-bold rounded-full w-8 h-8"
                      >
                        -
                      </button>
                    )}
                  </label>
                </div>
              ))}
              {question.answers.length < 4 && (
                <div className="m-1">
                  {question.answers.length + 1}.
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch({ type: "add_answer", questionIndex: index });
                    }}
                    className="rounded text-green-500 bg-green-100 px-2"
                  >
                    Add answer
                  </button>
                </div>
              )}
            </div>
          ))}
          {state.length < 3 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                dispatch({ type: "add_question" });
              }}
              className="rounded text-green-500 bg-green-100 p-2"
            >
              Add Question
            </button>
          )}
        </div>
        <div className="flex justify-end h-full w-full md:w-2/12">
          <button
            onClick={(e) => {
              e.preventDefault();
              saveQuestions();
            }}
            className="h-10 border border-green-600 bg-green-200 text-green-600 p-2 rounded w-full"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeeklyQuestions;
