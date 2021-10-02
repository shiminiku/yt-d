import type { NextApiRequest, NextApiResponse } from "next"
import https from "https"
import got from "got"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const watch = await got(`https://www.youtube.com/watch?v=${req.query.v}`)
  const base = await got(`https://www.youtube.com${watch.body.match(/script src="(.*?base.js)"/)[1]}`)

  let decipherFunc = base.body.match(/\w+=function\(.+\){(.+split\(""\);(.+?)\..+?.+?;return .+\.join\(""\))}/)
  let manipulator = base.body.match(new RegExp(`var ${decipherFunc[2]}={.+?};`, "s"))[0]
  let getSignature = new Function("a", manipulator + decipherFunc[1])

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Content-Type", "text/plain")
  res.send(getSignature(req.query.s))
}
