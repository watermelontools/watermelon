import admin from "../../utils/firebase/backend";
export default function handler(req, res) {
    let db = admin.firestore();
    let body = JSON.parse(req.body)
    let {lang, cat, signInToken} = body

    db.collection("teams")
    .doc(
      `${signInToken.team
        .id
      }`
    )
    .set({ settings: {language: lang, category: cat} }, { merge: true })
    .then(function (docRef) {
        res.status(200).json(JSON.stringify({ok:"ok"}))
    })
    .catch(function (error) {
      console.error("Error writing: ", error);
      res.status(500).json(JSON.stringify({ok:false}))
    });
  }
  