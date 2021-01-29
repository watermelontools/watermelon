import { useReducer } from "react";
import Button from "../components/Button";

const personTag = "${person}";
const answerTag = "${answer";

const initialState = [
  {
    question: "Does pineapple go on pizza?",
    icebreaker: "Hey ${person}, what about other fruits on pizza?",
    answers: ["Yes 🍍🍕", "NO!"],
  },
  {
    question: "Which is the best movie saga?",
    icebreaker: "What's your favourite movie in the ${answer} saga?",
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
          icebreaker:
            "You may use ${person} here to randomly select a user, and ${answer} to show the answer",
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
    case "add_person_tag": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].icebreaker =
        newQuestions[action.questionIndex].icebreaker + personTag;
      return newQuestions;
    }
    case "add_answer_tag": {
      let newQuestions = [...state];
      newQuestions[action.questionIndex].icebreaker =
        newQuestions[action.questionIndex].icebreaker + answerTag;
      return newQuestions;
    }
    default:
      throw new Error();
  }
};
const WeeklyQuestions = ({ firebaseApp }) => {
  const saveQuestions = () => {
    let db = firebaseApp.firestore();
    state.forEach((question) => {
      console.log(question.question);
      db.collection("teams")
        .doc(
          `${
            JSON.parse(window.localStorage.getItem("add_to_slack_token")).team
              .id
          }/weekly_questions/${question.question}`
        )
        .set({ icebreaker: question.icebreaker }, { merge: true })
        .then(function (docRef) {
          console.log("Wrote to db", docRef);
        })
        .catch(function (error) {
          console.error("Error writing: ", error);
        });
      question.answers.forEach((answer) => {
        db.collection("teams")
          .doc(
            `${
              JSON.parse(window.localStorage.getItem("add_to_slack_token")).team
                .id
            }`
          )
          .collection("weekly_questions")
          .doc(question.question)
          .collection(answer)
          .doc("picked_by")
          .set({ picked_by: [] }, { merge: true })
          .then(function (docRef) {
            console.log("Wrote to db", docRef);
          })
          .catch(function (error) {
            console.error("Error writing: ", error);
          });
      });
    });
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <h1>Weekly Questions</h1>
      <p>We allow minimum 2 questions and maximum 3, each with 2 answers.</p>
      <p>
        You may use the text <code>{answerTag}</code> to use the user selected
        answer and <code>{personTag}</code> to randomly select a person from the
        group.
      </p>
      <form className="flex flex-col md:flex-row w-full h-full items-end">
        <div className="w-full md:w-10/12">
          {state.map((question, index) => (
            <div className="my-2" key={index}>
              <div>
                <label className="w-full md:w-1/2 flex flex-col text-xl font-semibold">
                  <div className="flex justify-between my-1">Question</div>
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
                    id={`icebreaker-${index}`}
                    type="text"
                    placeholder="This will be the first message in the created group, use ${person} to select a random user to begin a conversation"
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
                <button
                  className="border border-gray-200 m-2"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "add_person_tag", questionIndex: index });
                  }}
                  title="Use this button to tag a person"
                >
                  Tag person
                </button>
                <button
                  className="border border-gray-200 m-2"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch({ type: "add_answer_tag", questionIndex: index });
                  }}
                  title="Use this button to add the selected answer"
                >
                  Show Answer
                </button>
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
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-end h-full w-full md:w-2/12">
          <Button
            onClick={(e) => {
              e.preventDefault();
              saveQuestions();
            }}
            text="Save"
            color="green"
            border
          />
        </div>
      </form>
    </div>
  );
};

export default WeeklyQuestions;
