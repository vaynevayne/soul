import {get, isEmpty} from "lodash-es"
import numeral from "numeral"

const cellBorderStyle = {
  style: "thin",
  color: {argb: "FFAEA1C5"},
}

const formatMap = {
  rate: "0.00%",
  money: "$0.00",
  int: "0.00",
  string: "@",
}
let columnMftMap = new Map()

// 根据结尾是否带有rate 来加 %
// 只支持一层结构, 不支持.value
export const getValueByDataIndex = (data, columns) => {
  const resTable = <any>[]
  if (isEmpty(data)) {
    return []
  }
  data.forEach((row) => {
    const newRow = {}
    columns.forEach((col) => {
      let value = get(row, col.dataIndex)

      newRow[col.dataIndex] = col.excelRender
        ? col.excelRender?.(value, row)
        : col.render
        ? col.render?.(value, row)
        : value
    })
    resTable.push(newRow)
  })

  return resTable
}

/**
 *
 * @param input  {value,color}, day1
 * @param dataIndex
 * @returns
 * 感觉不会 是 obj 类型, 因为 day1:{value:''} 被改成了 day1.value
 */
const textToNum = (input: any, dataIndex: string) => {
  let output = undefined as any
  if (typeof input === "string") {
    if (input.endsWith("%")) {
      // 兼容一下 百分号
      //  '10%' => 0.01 rate
      output = Number(input.replace("%", "")) / 100

      // 后面的 '' 值会把前面的类型给覆盖,比如 '%列', 因为最后一个是'', 就导致百分号失效
      if (!columnMftMap.has(dataIndex)) {
        columnMftMap.set(dataIndex, "rate")
      }
    } else if (
      // 判断是否数字类型字符串, 或者千分号字符串
      String(Number(input)) === input ||
      /^-?\d{1,3}(,\d{3})*(\.\d{1,2})?$/.test(input)
    ) {
      output = numeral(input).value()
      if (!columnMftMap.has(dataIndex)) {
        // 没有才会加, 第一行是* 后面变成 %, 那么就还是*
        columnMftMap.set(dataIndex, "int")
      }
    } else {
      // 字符串 需要忽略 '*' '-' 等字符串
      output = input
      if (!columnMftMap.has(dataIndex) && !["*", "_"].includes(input)) {
        columnMftMap.set(dataIndex, "string")
      }
    }
  } else if (typeof input === "number") {
    output = input
    if (!columnMftMap.has(dataIndex)) {
      columnMftMap.set(dataIndex, "int")
    }
  } else if (
    typeof input === "object" &&
    input !== null &&
    Object.hasOwn(input, "value")
  ) {
    output = input?.value

    if (!columnMftMap.has(dataIndex)) {
      columnMftMap.set(dataIndex, "int")
    }
  } else {
    output = String(input || "")
    console.warn("[SoulTable]:textToNum未知类型", input, dataIndex)
  }

  return output
}

const excelTableFormatted = (tableData) =>
  tableData
    ? tableData.map((row) => {
        return Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k, textToNum(v, k)])
        )
      })
    : []

function downloadExcel(workbook, fileName) {
  workbook.xlsx.writeBuffer({useStyles: true}).then((data) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
    const url = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    // eslint-disable-next-line no-param-reassign
    if (!fileName.endsWith(".xlsx")) fileName += ".xlsx"
    anchor.download = fileName
    anchor.click()
    window.URL.revokeObjectURL(url)
  })
}

function exportExcel(Excel, tableColumns, tableData, lines, fileName) {
  // 创建工作簿{#create-a-workbook}
  const workbook = new Excel.Workbook()
  // 设置工作簿属性
  workbook.creator = "EMA鹰眼2.0系统"
  // 创建工作表
  const worksheet = workbook.addWorksheet(fileName, {
    properties: {
      tabColor: {argb: "ffeaff8f"},
      defaultRowHeight: 20,
    },
  })
  // 添加列标题并定义列键和宽度
  // 注意：这些列结构只是工作簿构建方便，
  // 除了列宽之外，它们不会完全持久化。

  worksheet.columns = tableColumns.map((column) => {
    return {
      dataIndex: column.dataIndex,
      header: column.title,
      key: column.dataIndex,
      width: (column.width || 100) / 7,
      height: 70,
      style: {
        font: {
          size: 12,
          bold: true,
        },
        alignment: {
          vertical: "middle",
          // horizontal: column.oldType === "string" ? "left" : "right",
        },
        numFmt:
          column.numFmt ||
          formatMap[columnMftMap.get(column.dataIndex.toString())] ||
          "General",
      },
    }
  })

  // 冻结表格
  const ySplit = tableData.filter((item) => item.total_row).length + 1
  worksheet.views = [
    {
      state: "frozen",
      xSplit: tableColumns.filter((item) => item.fixedColumn).length,
      ySplit,
    },
  ]
  lines.forEach((line, index) => {
    const row = worksheet.addRow(line)
    row.eachCell({includeEmpty: true}, (cell) => {
      const isTotalRow = index + 1 >= ySplit
      if (isTotalRow) {
        // eslint-disable-next-line no-param-reassign
        cell.font = {
          bold: false,
          size: 12,
        }
      }
      // 隔行变色
      if (index % 2 === 0) {
        // eslint-disable-next-line no-param-reassign
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: {argb: isTotalRow ? "FFF7F1FD" : "FFF6D6B9"},
        }
        // eslint-disable-next-line no-param-reassign
        cell.border = {
          top: cellBorderStyle,
          bottom: cellBorderStyle,
          left: cellBorderStyle,
          right: cellBorderStyle,
        }
      }
    })
    // row.commit();
  })
  downloadExcel(workbook, fileName)
}

/**
 * @example await asyncExportTableData(columns, dataSource, filename)
 * @param tableColumns
 * @param tableData
 * @param fileName
 * @returns
 */
async function asyncExportTableData(tableColumns, tableData, fileName) {
  if (isEmpty(tableData)) {
    return
  }
  columnMftMap.clear()

  const {default: Excel} = await import("exceljs")

  // day1,value : 0.1005
  const formatted = excelTableFormatted(
    getValueByDataIndex(tableData, tableColumns)
  )
  const fixedTitleColumns = tableColumns?.map((item) => ({
    ...item,
    title: item.excelTitle || item.title,
  }))
  exportExcel(Excel, fixedTitleColumns, formatted, formatted, fileName)
  columnMftMap.clear()
}

export {asyncExportTableData}
