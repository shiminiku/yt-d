import type { NextApiRequest, NextApiResponse } from "next"
import got from "got"
import logAPIAccess from "../../lib/apiLogger"

export default async function video(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)

  const watch = await got(`https://www.youtube.com/watch?v=${req.query.v}`)

  console.log("watchbody:")
  console.log(watch.body)

  let playerResponse = new Function("return " + watch.body.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/)[1])()

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.json(playerResponse)
}
