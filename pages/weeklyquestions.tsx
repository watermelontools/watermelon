function WeeklyQuestions() {
  return (
    <div>
      <h1>Weekly Questions</h1>
      <p>We recommend having 3 questions per week.</p>
      <p>We allow minimum 2 questions and maximum 4, each varying between 2 and 4 answers.</p>
      <form>
        <div className="my-1">
          <div>
            <label className="w-full md:w-1/2 flex flex-col">
              Title
          <input type="text" maxLength={140} placeholder="Does pineapple go on pizza?"
                className="border rounded border-gray-200" />
            </label>
          </div>
          <div>
            <label className="w-full md:w-1/2 flex flex-col">
              Icebreaker
          <input type="text" placeholder="Hey @bob, what about other fruits on pizza?"
                className="border rounded border-gray-200" />
            </label>
          </div>
          <div>
            <label className="flex flex-nowrap w-full m-1 items-center" >
              A.
          <input type="text" maxLength={140} placeholder="Yes 🍍🍕"
                className="border rounded border-gray-200 mx-1 p-1" />
            </label>
          </div>
          <div>
            <label className="flex flex-nowrap w-full m-1 items-center">
              B.
          <input type="text" maxLength={140} placeholder="NO!"
                className="border rounded border-gray-200 mx-1 p-1" />
            </label>
          </div>
          <div className="m-1">
            C. <button className="border rounded border-green-500 bg-green-100 px-2">Add answer</button>
          </div>
        </div>
        <div className="my-1">
          <div>
            <label className="w-full md:w-1/2 flex flex-col">
              Title
          <input type="text" maxLength={140} placeholder="Which is the best movie saga?"
                className="border rounded border-gray-200" />
            </label>
          </div>
          <div>
            <label className="w-full md:w-1/2 flex flex-col">
              Icebreaker
          <input type="text" placeholder="Do you think @alice would be sorted into Griffyndor?"
                className="border rounded border-gray-200" />
            </label>
          </div>
          <div>
            <label className="flex flex-nowrap w-full m-1 items-center" >
              A.
          <input type="text" maxLength={140} placeholder="Harry Potter"
                className="border rounded border-gray-200 mx-1 p-1" />
            </label>
          </div>
          <div>
            <label className="flex flex-nowrap w-full m-1 items-center">
              B.
          <input type="text" maxLength={140} placeholder="Star Wars"
                className="border rounded border-gray-200 mx-1 p-1" />
            </label>
          </div>
          <div>
            <label className="flex flex-nowrap w-full m-1 items-center">
              C.
          <input type="text" maxLength={140} placeholder="Lord of the Rings"
                className="border rounded border-gray-200 mx-1 p-1" />
            </label>
          </div>
          <div className="m-1">
            C. <button className="border rounded border-green-500 bg-green-100 px-2">Add answer</button>
          </div>
        </div>
        <button className="border rounded border-red-500 bg-red-100">Add Question</button>
      </form>
    </div>
  )
}

export default WeeklyQuestions
