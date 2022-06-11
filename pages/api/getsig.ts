import type { NextApiRequest, NextApiResponse } from "next"
import logAPIAccess from "../../lib/apiLogger"
import { getPlayerResponse, getVideoURL } from "youtube-otosuyatu"

export default async function getsig(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (typeof req.query.v != "string" || typeof req.query.sc != "string") {
    res.status(400)
    res.send("")
    return
  }
  const { basejsURL } = await getPlayerResponse(req.query.v)
  const url = await getVideoURL(req.query.sc, basejsURL)

  res.setHeader("Content-Type", "text/plain")
  res.send(url)
}
