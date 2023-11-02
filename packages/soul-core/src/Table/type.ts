import {MenuProps, ModalProps, TableColumnType} from "antd"
import {MenuInfo} from "rc-menu/lib/interface"
import {Dispatch, ReactNode, SetStateAction} from "react"

/**
 *  order ,visible,disabled 是扩展的, 其他字段同 column
 * @desc  当 columns  为全局通用配置时,可以通过 columnsState 字段调整 table 特有的字段
 */
export type ColumnState = {
  order?: number
  visible?: boolean
  disabled?: boolean
  /** */
  fixed?: TableColumnType<any>["fixed"]
} & TableColumnType<any>

export type ColumnsState = Record<string, ColumnState>

export type ColumnWithState = ColumnState

export type Meta = {
  toolbar?: ReactNode | boolean
  /**
   * 关闭默认 excel 导出, await asyncExportTableData(columns, dataSource, filename)
   */
  disableExcel?: boolean
  /**
   * 隐藏 setting
   */
  disableSetting?: boolean

  /**
   * 隐藏折叠按钮
   */
  disableCollapse?: boolean
  /**
   * 导出 excel 的默认文件名
   */
  filename?: string
  /**
   * 默认状态下,所有列的显示情况
   */
  defaultVisible?: boolean

  collapseOrder?: Record<string, string[]>
  /**
   * 右键菜单
   */
  items?: MenuProps["items"]
  onItemClick?: (params: {row: Record<string, any>; menuInfo: MenuInfo}) => void

  settingModalProps?: Omit<ModalProps, "onOk"> & {
    onOk: (columnsState: ColumnsState) => Promise<any> | void
  }

  /**
   * 当 checked 被点击时调用,如果传入则需要自己处理 setState,以便支持更复杂的联动
   * @param checked
   * @param setLocalColumns
   * @param index
   * @param column
   * @example onCheckboxChange(checked,setLocalColumns){
   *    setLocalColumns(localColumns=>
   *                     produce(localColumns, (draft) => {
   *                       draft[index].visible = checked;
   *                     }),
   *                   );
   * }
   */
  onCheckboxChange?(
    checked: boolean,
    setLocalColumns: Dispatch<SetStateAction<any>>,
    index: number,
    column: ColumnWithState
  ): void
}

export type SoulTableColumn<RecordType = unknown> =
  TableColumnType<RecordType> & ColumnState
