const BASE_URL = "https://yt-dp.smnk.workers.dev"

// TODO: What the poToken???
export async function GET_playerResponse(videoId: string) {
  return (await fetch(`${BASE_URL}/playerResponse?v=${videoId}`).then((r) =>
    r.status === 200 ? r.json() : Promise.reject(new Error("returned not 200."))
  )) as {
    playerResponse?: any
    basejsURL: string
  }
}

// `/watch` uses ios user-agent, avoids poToken!
export async function GET_watch(videoId: string) {
  return (await fetch(`${BASE_URL}/watch?v=${videoId}`).then((r) =>
    r.status === 200 ? r.json() : Promise.reject(new Error("returned not 200."))
  )) as {
    ytcfg: any
    pagePlayerResponse: any
    playerResponse: any
    basejsURL: string
    signatureTimestamp: number
  }
}

export function sigCodeJSsrc(baseJsUrl: string) {
  return `${BASE_URL}/sigCode.js?basejs=${encodeURIComponent(baseJsUrl)}`
}
