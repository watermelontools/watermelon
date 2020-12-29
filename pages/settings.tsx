import { useReducer } from "react"

import Button from "../components/Button"

import timezones from "../public/data/timezones.js"

const initialState = 
  {
    weekday: "saturday",
    timezone: "-5",
    time: "15:30",
    auto_delete: "force"
  }
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
            Watermelon will send the questionaire on this day. We recommend avoiding holidays and weekends.
        </p>
        </div>
        <select className="w-1/3"
        value={state.weekday}
         onChange={e=>{e.preventDefault(); dispatch({type: "set_weekday", weekday: e.target.value})}}>
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
            Watermelon will send the questionaire at this hour. We recommend early mornings or midafternoon.
        </p>
        </div>
        <input type="time" value="09:30"></input>
      </div>
      <div className="flex flex-wrap w-3/4 justify-between">
        <div className="w-1/2">
          <h2>Autodelete</h2>
          <p>
            Watermelon will erase the groups created with this rule.
        </p>
        </div>
        <div>
          <div>
            <input type="radio" id="force" name="deletion" value="force" />
            <label htmlFor="force">Force deletion in 14 days</label>
          </div>
          <div>
            <input type="radio" id="inactive" name="deletion" value="inactive" />
            <label htmlFor="inactive">Delete if inactive for 14 days</label>
          </div>
          <div>
            <input type="radio" id="never" name="deletion" value="never" />
            <label htmlFor="never">Never delete</label>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap w-3/4 justify-between">
        <div className="w-1/2">
          <h2>Timezone</h2>
          <p>
            Watermelon will use this to calculate the time for every member. Please select one that fits the majority of your teammates.
        </p>
        </div>
        <select className="w-1/3" 
        value={state.timezone}
        onChange={e=>{e.preventDefault(); dispatch({type: "set_timezone", timezone: e.target.value})}}>
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
