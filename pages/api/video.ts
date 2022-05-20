import type { NextApiRequest, NextApiResponse } from "next"
import got from "got"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { remoteAddress, remotePort, remoteFamily } = req.socket
  console.log(`${remoteAddress} : ${remotePort}, ${remoteFamily}`)
  console.log(req.rawHeaders)
  console.log("----------")

  const watch = await got(`https://www.youtube.com/watch?v=${req.query.v}`)

  let playerResponse = new Function("return " + watch.body.match(/ytInitialPlayerResponse\s*=\s*(\{.*?\});/)[1])()

  res.setHeader("Access-Control-Allow-Origin", "*")
  res.json(playerResponse)
}
