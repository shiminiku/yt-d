import type { NextApiRequest, NextApiResponse } from "next"
import https from "https"

export default (req: NextApiRequest, res: NextApiResponse) => {
  https
    .request(
      `https://www.youtube.com/watch?v=${req.query.v}&pbj=1`,
      {
        method: "POST",
      },
      (postRes) => {
        postRes.setEncoding("utf8")
        let resBody = ""
        postRes.on("data", (chunk) => (resBody += chunk))
        postRes.on("end", () => {
          res.setHeader("Access-Control-Allow-Origin", "*")
          res.json(resBody)
        })
      }
    )
    .end()
}
