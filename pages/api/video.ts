import type { NextApiRequest, NextApiResponse } from "next"
import got from "got"
import logAPIAccess from "../../lib/apiLogger"

export default async function video(req: NextApiRequest, res: NextApiResponse) {
  logAPIAccess(req)
  res.setHeader("Access-Control-Allow-Origin", "*")

  const watchPage = await got(`https://www.youtube.com/watch?v=${req.query.v}`)

  console.log("watch.status:", watchPage.statusCode)

  const match = watchPage.body.match(/var\s+ytInitialPlayerResponse\s+=\s+(\{.*?\});?<\/script>/)
  if (!match?.[1]) {
    res.status(500)
    res.send(`not found match: ${match}`)
    return
  }

  try {
    res.json(new Function("return " + match[1])())
  } catch (e) {
    console.error(e)
    console.error(watchPage.body)
    res.status(500)
    res.send(watchPage.body)
  }
}
