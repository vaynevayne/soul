import {DownloadOutlined, SettingOutlined} from "@ant-design/icons"
import {useUncontrolled, useWatch} from "@soul/utils"
import {
  TableProps as AntTableProps,
  Button,
  Col,
  Row,
  Space,
  Table,
  TableColumnType,
  TableColumnsType,
  Tooltip,
} from "antd"
import {arrayMoveImmutable} from "array-move"
import {produce} from "immer"
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from "react"
import {Item, Menu, useContextMenu} from "react-contexify"
import "react-contexify/dist/ReactContexify.css"
import ReactDragListView from "react-drag-listview"
import "react-resizable/css/styles.css"
import ExcelModal from "./ExcelModal"
import {ResizeableTitle} from "./ResizeableTitle"
import SettingModal from "./SettingModal"
import {ColumnsStateContext} from "./context"
import {
  ColumnState,
  ColumnWithState,
  ColumnsState,
  Meta,
  SoulTableColumn,
} from "./type"
import {findColKey, getSorter, getState, getVisible} from "./util"

interface Handle {
  getTableColumns(): TableColumnsType
}

export type TableProps = {
  /**
   * @description 可以在 column 中传入相关 columnState, 将作为默认值使用
   */
  columns: SoulTableColumn[]

  defaultColumnsState?: ColumnsState

  columnsState?: ColumnsState

  onColumnsStateChange?: (columnsState: ColumnsState) => void
  rewriteColumns?: (columns: TableColumnsType) => TableColumnsType
  meta?: Meta
} & AntTableProps<any>

const MENU_ID = "menu-id"

const SoulTable: React.ForwardRefRenderFunction<Handle, TableProps> = (
  {
    columns: propColumns,
    defaultColumnsState,
    columnsState: propColumnsState,
    onColumnsStateChange,
    meta: propMeta,
    dataSource: propDataSource,
    title,

    rewriteColumns,
    ...tableProps
  },
  ref
) => {
  // 函数参数默认值对 null 无效,所以在这里写引用类型默认值
  const columns = useMemo(() => propColumns || [], [propColumns])
  const meta = useMemo(
    () => ({
      defaultVisible: true,
      ...propMeta,
    }),
    [propMeta]
  )
  const [dataSource, setDateSource] = useState<any[]>([])

  useWatch(
    propDataSource,
    (newVal) => {
      console.log("newVal", newVal)

      setDateSource([...(newVal || [])])
    },
    {immediate: true}
  )

  const [columnsState, setColumnsState] = useUncontrolled<ColumnsState>({
    value: propColumnsState,
    defaultValue: defaultColumnsState,
    finalValue: {},
    onChange: onColumnsStateChange,
  })

  const [isOpenedSetting, setIsOpenedSetting] = useState(false)
  // excel modal
  const [isOpenedExcel, setIsOpenedExcel] = useState(false)

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const {show} = useContextMenu({
    id: MENU_ID,
  })

  type Key = keyof ColumnState

  const setColumnState = useCallback(
    (colKey: string, key: Key, value: ColumnState[Key]) => {
      console.log("log:setColumnState", colKey, key, value)

      console.log("prev", JSON.stringify(columnsState))
      const newColumns = produce(columnsState, (draft) => {
        draft[colKey] = {
          ...draft[colKey],
          [key]: value,
        }
      })

      console.log("newColumns", JSON.stringify(newColumns))

      setColumnsState(newColumns)
    },

    [columnsState, setColumnsState]
  )

  const contextValue = useMemo(
    () => ({
      columnsState,
      setColumnsState,
      setColumnState,
    }),
    [columnsState, setColumnsState, setColumnState]
  )

  /** @example { name: 100} */
  const [widthState, setWidthState] = useState({}) // ref 不会工作

  const handleResize = useCallback(
    (column: TableColumnType<any>) =>
      (_, {size}) => {
        const colKey = findColKey(column)
        setWidthState({
          ...widthState,
          [colKey]: size.width,
        })
        // setColumnState(colKey, "width", size.width)
      },
    [widthState]
  )

  const tableColumns = useMemo<any>(() => {
    return columns
      .filter(Boolean)
      .sort(getSorter(columnsState))
      .filter(getVisible(columnsState, meta.defaultVisible))
      .map((column) => ({
        ...column,
        ...getState(columnsState, column), // 可以把 defaultSortOrder 放上
        width:
          widthState[findColKey(column)] ||
          getState(columnsState, column)?.width ||
          column.width,
        onHeaderCell: (column) => ({
          width:
            widthState[findColKey(column)] ||
            getState(columnsState, column)?.width ||
            column.width,
          onResize: handleResize(column),
        }),
      }))
  }, [columns, columnsState, handleResize, meta.defaultVisible, widthState])

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const moved = arrayMoveImmutable<ColumnWithState>(
        tableColumns,
        fromIndex,
        toIndex
      )

      const newColumnsState = produce(columnsState, (draft) => {
        moved.forEach((col, idx) => {
          const colKey = findColKey(col)
          draft[colKey] = {
            ...draft[colKey],
            order: idx,
          }
        })
      })

      setColumnsState(newColumnsState)
    },
    nodeSelector: "th:not(.ant-table-cell-fix-left)",
    // ignoreSelector: ".ant-table-cell-fix-left",
  }

  const dragRowProps = {
    onDragEnd(fromIndex, toIndex) {
      const moved = arrayMoveImmutable<any>(dataSource, fromIndex, toIndex)
      setDateSource(moved)
    },
    handleSelector: ".drag-icon",
    // nodeSelector: 'tr.ant-table-row',
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        getTableColumns: () => tableColumns,
        // ... your methods ...
      }
    },
    [tableColumns]
  )

  console.log("tableColumns", tableColumns)
  console.log("dataSource", dataSource)

  return (
    <>
      <ColumnsStateContext.Provider value={contextValue}>
        <Row wrap={false}>
          <Col flex={1}>{title?.(dataSource)}</Col>
          <Col flex="none">
            {meta.toolbar === false ? null : (
              <Space style={{marginBottom: 8, marginLeft: "auto"}}>
                <Tooltip title="列配置">
                  <Button
                    type="text"
                    onClick={() => setIsOpenedSetting(true)}
                    size="small"
                    icon={<SettingOutlined />}
                  ></Button>
                </Tooltip>

                {meta.disableExcel ? null : (
                  <Tooltip title="导出excel">
                    <Button
                      type="text"
                      onClick={() => setIsOpenedExcel(true)}
                      size="small"
                      icon={<DownloadOutlined />}
                    ></Button>
                  </Tooltip>
                )}

                {meta.toolbar}
              </Space>
            )}
          </Col>
        </Row>

        <ReactDragListView.DragColumn {...dragProps}>
          <ReactDragListView {...dragRowProps}>
            <Table
              columns={rewriteColumns?.(tableColumns) || tableColumns}
              {...(meta.contextMenus && {
                onRow: (record) => {
                  return {
                    onContextMenu: (event) => {
                      show({
                        event,
                        props: record,
                      })
                    },
                  }
                },
              })}
              components={{
                header: {
                  cell: ResizeableTitle,
                },
              }}
              dataSource={dataSource}
              {...tableProps}
            />
          </ReactDragListView>
        </ReactDragListView.DragColumn>

        {
          // 列设置
          // 不能去除, 为了每次打开modal, useState重新执行
          isOpenedSetting && (
            <SettingModal
              columns={columns}
              open={isOpenedSetting}
              setIsOpenedSetting={setIsOpenedSetting}
              meta={meta}
            ></SettingModal>
          )
        }
        {
          // 导出 excel
          isOpenedExcel && (
            <ExcelModal
              columns={tableColumns}
              dataSource={dataSource}
              open={isOpenedExcel}
              setIsOpenedExcel={setIsOpenedExcel}
              meta={meta}
            ></ExcelModal>
          )
        }

        {/* 右键菜单 */}
        {meta.contextMenus?.length && (
          <Menu id={MENU_ID}>
            {meta.contextMenus.map((item, index) => (
              <Item
                key={item.key || index}
                onClick={meta.onContextMenuItemClick}
                {...item}
              >
                {item.children}
              </Item>
            ))}
          </Menu>
        )}
      </ColumnsStateContext.Provider>
    </>
  )
}

const ForwardTable = forwardRef(SoulTable)
const MemoTable = memo(ForwardTable)
export default MemoTable
