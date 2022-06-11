import { AppProps } from "next/app"
import { StrictMode } from "react"

import "../styles/global.scss"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StrictMode>
      <Component {...pageProps} />
    </StrictMode>
  )
}
