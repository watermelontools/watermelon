import { useReducer } from "react"

import Button from "../components/Button"

import timezones from "../public/data/timezones.js"

const initialState = [
  {
    weekday: 0,
    timezone: "-5",
    time: "13:30",
    auto_delete: "auto"
  },
]
const reducer = (state, action) => {
  switch (action.type) {
    case "set_weekday": {
      return ({
        ...state,
        weekday: action.weekday
      })
    }
    case "set_timezone": {
      return ({
        ...state,
        timezone: action.timezone
      })
    }
    case "set_time": {
      return ({
        ...state,
        time: action.time
      })
    }
    case "set_auto_delete": {
      return ({
        ...state,
        auto_delete: action.auto_delete
      })
    }
    default:
      throw new Error();
  }
}

const Settings = ({ firebaseApp }) => {
  const saveQuestions = () => {
    let db = firebaseApp.firestore()
    db.collection("users").doc("maria@lean-tech.io").set({
      settings: state
    }, { merge: true })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef)
      })
      .catch(function (error) {
        console.error("Error adding document: ", error)
      })
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <h1>Settings</h1>
      <div className="flex flex-wrap w-3/4 justify-between">
        <div className="w-1/2">
          <h2>Day</h2>
          <p>
            Watermelon will send the questionaire on this day.
        </p>
        </div>
        <select className="w-1/3">
          <option value="monday">Monday</option>
          <option value="mondtuesdayay">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>
      <div className="flex flex-wrap w-3/4 justify-between">
        <div className="w-1/2">
          <h2>Time</h2>
          <p>
            Watermelon will send the questionaire at this hour.
        </p>
        </div>
        <select>
          {timezones.map((tz, i) =>
            <option value={tz.offset}>{tz.text}</option>)}
        </select>
        <div className="w-full flex justify-end">
          <Button onClick={e => console.log(e)} text="Save" />
        </div>
      </div>
    </div>
  )
}

export default Settings
