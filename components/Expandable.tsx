"use client"

import { useState } from "react"
import style from "./page.module.scss"

export function Expandable({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={expanded ? style.expanded : style.expandable} onClick={() => setExpanded(true)}>
      <div className={style.content}>{children}</div>
      <button
        className={style.expandButton}
        onClick={(ev) => {
          ev.stopPropagation()
          setExpanded(!expanded)
        }}
      >
        {expanded ? "閉じる" : "もっと見る"}
      </button>
    </div>
  )
}
