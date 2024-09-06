import { createContext } from "react"
import { Help } from "./Helps"

export const ShowHelpContext = createContext<((help: Help) => void) | undefined>(undefined)
