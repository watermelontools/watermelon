const SlackQuestionDemo = ({ question }: { question: { Question: string; AnswerA: string; AnswerB: string; Icebreaker: string; } }) =>
    <div className="flex hover:bg-gray-50 border-gray-200 border-t-2 w-full mt-2">
        <div className="rounded mx-2" style={{ width: "3em", height: "3em" }}>
            <img src="/wmslack.png" />
        </div>
        <div>
            <div className="flex">

                <p className="font-bold text-lg">Watermelon</p>
                <div className="flex-col flex justify-center">

                    <p className="bg-gray-200 rounded-sm text-xs ml-2 px-1 text-gray-500 leading-1">APP</p>
                </div>
            </div>
            <p className="font-semibold">{question.Question}</p>
            <div className="flex justify-start my-1">
                <p className="border border-gray-200 rounded px-2 py-1 mr-2 hover:bg-gray-100">{question.AnswerA}</p>
                <p className="border border-gray-200 rounded px-2 py-1 hover:bg-gray-100">{question.AnswerB}</p>
            </div>
            <p>{question.Icebreaker}</p>
        </div>
    </div>
export default SlackQuestionDemo