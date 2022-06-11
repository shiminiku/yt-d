import type { NextApiRequest, NextApiResponse } from "next"
import logAPIAccess from "../../lib/apiLogger"
import { getPlayerResponse } from "youtube-otosuyatu"

export default async function video(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  const { playerResponse } = await getPlayerResponse(req.query.v)

  try {
    res.json(playerResponse)
  } catch (e) {
    console.error(e)
    res.status(500)
    res.send(":(")
  }
}
