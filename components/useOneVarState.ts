import { Dispatch, SetStateAction, useState } from "react"

type SettableState<S> = S & {
  setState: Dispatch<SetStateAction<S>>
  __proto__: {
    setState: Dispatch<SetStateAction<S>>
  }
}

export function useOneVarState<S>(initialState: S | (() => S)) {
  const [state, setState] = useState(initialState)

  const settableState = state as SettableState<S>
  settableState.__proto__.setState = setState

  return settableState
}
