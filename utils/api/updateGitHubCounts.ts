import type { NextApiRequest, NextApiResponse } from 'next'
import updateGitHubQueryCounts from '../../utils/db/github/updateGitHubQueryCounts'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    const data = await updateGitHubQueryCounts()
    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({error: 'Error updating GitHub counts'})
  }
}