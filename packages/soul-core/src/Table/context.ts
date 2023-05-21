import { createContext, Dispatch, useContext } from "react";
import { ColumnsState, ColumnState } from "./type";

/** Table columnsState */

export const ColumnsStateContext = createContext<{
  columnsState: ColumnsState;
  setColumnsState: Dispatch<ColumnsState>;
  setColumnState: (colKey: string, key: keyof ColumnState, value: any) => void;
}>({ columnsState: {}, setColumnsState: () => {}, setColumnState: () => {} });

export const useColumnsStateContext = () => useContext(ColumnsStateContext);
