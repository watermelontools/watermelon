import Button from "../components/Button"
function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      <div className="w-full flex justify-end">
        <Button onClick={e => console.log(e)} text="Save" />
      </div>
    </div>
  )
}

export default Settings
