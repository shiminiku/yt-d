import { BaseFormat } from "@shiminiku/yt-o"
import style from "/styles/FormatFilters.module.scss"

interface Filter {
  label: string
  filter: string
}
const FILTERS: Filter[] = [
  { label: "映像", filter: "video" },
  { label: "音声", filter: "audio" },
  { label: "", filter: "" },
  { label: "MP4", filter: "mp4" },
  { label: "WebM", filter: "webm" },
  { label: "", filter: "" },
  { label: "H.264", filter: "avc1" },
  { label: "VP9", filter: "vp9" },
  { label: "AV1", filter: "av01" },
  { label: "", filter: "" },
  { label: "AAC", filter: "mp4a" },
  { label: "Opus", filter: "opus" },
]

export function formatsFilter(filterIdx: number | null) {
  return (fmt: BaseFormat) => (filterIdx !== null ? fmt.mimeType.includes(FILTERS[filterIdx].filter) : true)
}

export function FormatFilters({
  radioId,
  selected,
  setSelected,
}: {
  radioId: string
  selected: number | null
  setSelected: React.Dispatch<React.SetStateAction<number | null>>
}) {
  const radioGroup = `format-filter--${radioId}`

  return (
    <div className={style.filters}>
      {FILTERS.map((f, i) => (
        <span key={i}>
          {f.filter.length === 0 ? (
            "・"
          ) : (
            <>
              <input
                type="radio"
                className={style.filterInput}
                name={radioGroup}
                id={`${radioGroup}--${f.filter}`}
                checked={selected === i}
                onChange={() => {
                  setSelected(i)
                }}
                onClick={() => {
                  setSelected((p) => (p === i ? null : p))
                }}
              />
              <label htmlFor={`${radioGroup}--${f.filter}`} className={style.filterLabel}>
                {f.label}
              </label>
            </>
          )}
        </span>
      ))}
    </div>
  )
}
