import { getStreamURL } from "@shiminiku/yt-o"

export async function POST(req: Request) {
  const { fmt, basejsURL } = await req.json()

  return new Response(await getStreamURL(fmt, basejsURL))
}
