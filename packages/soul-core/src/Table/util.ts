import {TableColumnType} from "antd"
import {ColumnsState, ColumnWithState} from "./type"

/**
 * @desc (key || dataIndex).toString()
 * @param column
 * @returns
 */
export const findColKey = (column: TableColumnType<any>) => {
  if (!column) return ""
  const {key = "", dataIndex = ""} = column

  if (!key && !dataIndex) {
    console.warn(
      `[@soul/components:Table],错误: 请补充 key 或 dataIndex, 否则该列无法正常使用,列 ${JSON.stringify(
        column,
        null,
        2
      )} `
    )
    return ""
  }

  return (key || dataIndex).toString() // ['a','b'] => 'a,b'
}

export const getSorter =
  (columnsState: ColumnsState) =>
  (columnA: ColumnWithState, columnB: ColumnWithState) => {
    const stateA = columnsState[findColKey(columnA)] || {}
    const stateB = columnsState[findColKey(columnB)] || {}

    // 当都是 leftColumns  | centerColumns时,比较 order,
    if (Boolean(stateA.fixed) === Boolean(stateB.fixed)) {
      return (
        (stateA.order || columnA.order || 0) -
        (stateB.order || columnB.order || 0)
      )
    } else {
      // 当不同时, left 总是在左边 center
      return stateA.fixed === "left" ? -1 : 1
    }
  }

/** 先 sort 再 filter */
export const getVisible =
  (columnsState: ColumnsState, defaultVisible: boolean) =>
  (column: ColumnWithState) => {
    let res = true

    const state = columnsState?.[findColKey(column)] || {}
    if (Object.prototype.hasOwnProperty.call(state, "visible")) {
      res = !!state.visible
    } else if (Object.prototype.hasOwnProperty.call(column, "visible")) {
      res = !!column.visible
    } else {
      res = defaultVisible
    }

    return res
  }

/** 先 sort 再 filter */
export const getState = (columnsState: ColumnsState, column: ColumnWithState) =>
  columnsState[findColKey(column)] || {}

export const mapStateToColumns = (
  columns: ColumnWithState[],
  columnsState: ColumnsState,
  defaultVisible: boolean
) => {
  return columns.map((column) => {
    return {
      ...column,
      ...getState(columnsState, column),
      visible: !!getVisible(columnsState, defaultVisible)(column),
    }
  })
}

export const findMaxOrder = (columnsState: ColumnsState) => {
  let maxFixedOrder = 0
  let maxCenterOrder = 0

  Object.entries(columnsState).forEach(([_, state]) => {
    if (state.fixed === "left") {
      maxFixedOrder = Math.max(maxFixedOrder, state.order || 0)
    } else {
      maxCenterOrder = Math.max(maxCenterOrder, state.order || 0)
    }
  })

  return [maxFixedOrder, maxCenterOrder]
}
