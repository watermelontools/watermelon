import admin from "../../../../utils/firebase/backend";

let db = admin.firestore();
export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;
  async function getInstallationToken(teamId) {
    const teamRef = db.collection("teams").doc(teamId);
    const doc = await teamRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      return doc.data();
    }
  }
  let data = await getInstallationToken(teamId);
}
