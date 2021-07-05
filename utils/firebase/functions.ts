export async function savePickedBy({
  admin,
  db,
  teamId,
  questionName,
  answerTitle,
  userId,
}) {
  let testWeeklyQuestionsRef = db
    .collection("teams")
    .doc(teamId)
    .collection("weekly_questions")
    .doc(questionName)
    .collection(answerTitle)
    .doc("picked_by");
  await testWeeklyQuestionsRef.update({
    picked_by: admin.firestore.FieldValue.arrayUnion(userId),
  });
}
