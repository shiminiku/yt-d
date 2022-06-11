import type { NextApiRequest, NextApiResponse } from "next"
import got from "got"
import logAPIAccess from "../../lib/apiLogger"
import { getURL } from "youtube-otosuyatu"

export default async function getsig(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)

  const watch = await got(`https://www.youtube.com/watch?v=${req.query.v}`)
  const url = await getURL(req.query.sc, `https://www.youtube.com${watch.body.match(/script src="(.*?base.js)"/)[1]}`)

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "text/plain")
  res.send(url)
}
