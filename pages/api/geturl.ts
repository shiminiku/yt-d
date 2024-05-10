import type { NextApiRequest, NextApiResponse } from "next"
import logAPIAccess from "../../lib/apiLogger"
import { getPlayerResponse, getVideoURL } from "@shiminiku/yt-o"

export default async function geturl(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (typeof req.query.v != "string" || typeof req.query.url != "string") {
    res.status(400)
    res.send("")
    return
  }
  const { basejsURL } = await getPlayerResponse(req.query.v)
  const url = await getVideoURL(req.query.url, basejsURL)

  res.setHeader("Content-Type", "text/plain")
  res.send(url)
}
