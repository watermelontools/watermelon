import { createAnswer, createQuestion, getAllQuestions } from "../../../../../utils/airtable/backend";

export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;
  let found = (
    await getAllQuestions(
    )
  );
  let qs = []
  for (let index = 0; index < found.length; index++) {
    const element = found[index];
    let qCreated = await createQuestion({
      Question: element.fields.Question,
      Language: "en",
      Icebreaker1: element.fields.Icebreaker,
      Icebreaker2: element.fields.Icebreaker1,
      Icebreaker3: element.fields.Icebreaker2,
      ContrarianIcebreaker1: element.fields.contrarian_icebreaker,
      ContrarianIcebreaker2: element.fields.contrarian_icebreaker_1,
      ContrarianIcebreaker3: element.fields.contrarian_icebreaker_2,
    })
    let ans = ["A", "B", "C", "D"]
    for (let j = 0; j < ans.length; j++) {
      const answerLetter = ans[j];
      await createAnswer({
        AnswerTitle: element.fields[`Answer${answerLetter}`],
        Image: element.fields[`Image${answerLetter}`],
        IsContrarian: answerLetter === "D" ? true : false,
        QuestionsA: answerLetter === "A" ? [qCreated.id] : null,
        QuestionsB: answerLetter === "B" ? [qCreated.id] : null,
        QuestionsC: answerLetter === "C" ? [qCreated.id] : null,
        QuestionsD: answerLetter === "D" ? [qCreated.id] : null,
      })
    }
    qs.push(qCreated)
  }
  res.send(qs);
}
