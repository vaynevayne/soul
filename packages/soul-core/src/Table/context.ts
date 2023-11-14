import {createContext, Dispatch, useContext} from "react"
import {ColumnsState, ColumnState, Meta, SoulTableColumn} from "./type"

/** Table columnsState */

export const ColumnsStateContext = createContext<{
  columnsState: ColumnsState
  columns: SoulTableColumn[]
  meta: Meta
  setColumnsState: Dispatch<ColumnsState>
  setColumnState: (colKey: string, key: keyof ColumnState, value: any) => void
  isControlled: boolean
}>({
  columnsState: {},
  setColumnsState: () => {},
  setColumnState: () => {},
  meta: {},
  columns: [],
  isControlled: true,
})

export const useColumnsStateContext = () => useContext(ColumnsStateContext)
