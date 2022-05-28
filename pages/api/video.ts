import type { NextApiRequest, NextApiResponse } from "next"
import got from "got"
import logAPIAccess from "../../lib/apiLogger"

export default async function video(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  const watch = await got(`https://www.youtube.com/watch?v=${req.query.v}`)

  console.log("watch.status:", watch.statusCode)

  const match = watch.body.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/)
  if (!match?.[1]) {
    res.status(500)
    res.send(`not found match: ${match}`)
    return
  }

  try {
    res.json(new Function("return " + match[1])())
  } catch (e) {
    console.error(e)
    console.error("match", match)
    res.status(500)
    res.send(`err ${match}`)
  }
}
