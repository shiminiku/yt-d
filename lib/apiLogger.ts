import { NextApiRequest } from "next"

export default function logAPIAccess(req: NextApiRequest) {
  const { remoteAddress, remotePort, remoteFamily } = req.socket
  const { localAddress, localPort } = req.socket
  console.log(`remote: ${remoteAddress} : ${remotePort}, ${remoteFamily}`)
  console.log(`local: ${localAddress} : ${localPort}`)
  console.log("request headers:", req.headers)
}
