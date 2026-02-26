"use client"
import { useFormStatus } from "react-dom"
import RandLoading from "../../components/RandLoad"
import style from "./page.module.scss"
import { useActionState } from "react"
import { submitLens } from "./lensActions"

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? <RandLoading /> : "OK"}
    </button>
  )
}

export function LensForm() {
  const [error, formAction, pending] = useActionState(submitLens, null)

  return (
    <>
      <form className={style.form} action={formAction}>
        <input
          className={style.idInput}
          type="text"
          name="url"
          required
          placeholder="リンク、動画ID (jNQXAC9IVRw, https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
        />
        <SubmitButton />
      </form>
      {error && <p>{error}</p>}
      {pending && (
        <p>
          <RandLoading /> Loading... <RandLoading />
        </p>
      )}
    </>
  )
}
