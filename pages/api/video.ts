import type { NextApiRequest, NextApiResponse } from "next"
import logAPIAccess from "../../lib/apiLogger"
import { getPlayerResponse } from "@shiminiku/yt-o"

export type APIResp_video = Awaited<ReturnType<typeof getPlayerResponse>>

export default async function video(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  if (typeof req.query.v != "string") {
    res.status(400)
    res.send("")
    return
  }
  const pr_base = await getPlayerResponse(req.query.v)

  try {
    res.json(pr_base)
  } catch (e) {
    console.error(e)
    res.status(500)
    res.send("")
  }
}
