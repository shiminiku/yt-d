import style from "../styles/BooleanItem.module.scss"

export function BooleanItem({ title, value }: { title: string; value: boolean }) {
  return (
    <span>
      {title}: <span className={value ? style.true : style.false}>{value ? "はい" : "いいえ"}</span>
    </span>
  )
}
