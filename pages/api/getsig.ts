import type { NextApiRequest, NextApiResponse } from "next"
import https from "https"

export default (req: NextApiRequest, res: NextApiResponse) => {
  https.get(`https://www.youtube.com/watch?v=${req.query.v}`, (getRes) => {
    let resBody = ""
    getRes.on("data", (chunk) => {
      resBody += chunk
    })
    getRes.on("end", () => {
      https.get(`https://www.youtube.com${resBody.match(/script src="(.*?base.js)"/)[1]}`, (getRes) => {
        let resBody = ""
        getRes.on("data", (chunk) => {
          resBody += chunk
        })

        getRes.on("end", () => {
          let decipherFunc = resBody.match(/\w+=function\(.+\){(.+split\(""\);(.+?)\..+?.+?;return .+\.join\(""\))}/)
          let manipulator = resBody.match(new RegExp(`var ${decipherFunc[2]}={.+?};`, "s"))[0]
          let getSignature = new Function("a", manipulator + decipherFunc[1])

          res.setHeader("Access-Control-Allow-Origin", "*")
          res.setHeader("Content-Type", "text/plain")
          res.send(getSignature(req.query.s))
        })
      })
    })
  })
}
