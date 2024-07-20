import type { NextApiRequest, NextApiResponse } from "next"
import logAPIAccess from "../../lib/apiLogger"
import { getSCVideoURL } from "@shiminiku/yt-o"

export default async function getsig(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (typeof req.query.v != "string" || typeof req.query.sc != "string" || typeof req.query.basejs != "string") {
    res.status(400)
    res.send("")
    return
  }
  const url = await getSCVideoURL(req.query.sc, req.query.basejs)

  res.setHeader("Content-Type", "text/plain")
  res.send(url)
}
