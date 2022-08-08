import getAssignedTickets from "../../../utils/jira/getAssignedTickets";

export default async function handler(req, res) {
    let { user } = req.body;
    if (!user) {
      return res.send({ error: "no user" });
    }
    let organization = await getAssignedTickets();
    return res.send(organization);
}