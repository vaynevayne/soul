import {
  CopyOutlined,
  DownOutlined,
  DownloadOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons"
import {useUncontrolled, useWatch} from "@soul/utils"
import {
  TableProps as AntTableProps,
  Button,
  Col,
  Dropdown,
  Row,
  Space,
  Spin,
  Table,
  TableColumnType,
  Tooltip,
} from "antd"
import {arrayMoveImmutable} from "array-move"
import {produce} from "immer"
import {
  Suspense,
  forwardRef,
  lazy,
  memo,
  useCallback,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {Collapse} from "react-collapse"

import ReactDragListView from "react-drag-listview"
import "react-resizable/css/styles.css"

const ExcelModal = lazy(() => import("./ExcelModal"))
import {ResizeableTitle} from "./ResizeableTitle"
const SettingModal = lazy(() => import("./SettingModal"))

import {ColumnsStateContext} from "./context"
import {ColumnState, ColumnWithState, ColumnsState, Meta} from "./type"
import {findColKey, getSorter, getState, getVisible} from "./util"
import ClipboardJS from "clipboard"
import {isEmpty} from "lodash-es"

interface Handle {
  getTableColumns(): TableColumnType<object>[]
}

export type TableProps = {
  /**
   * @description 可以在 column 中传入相关 columnState, 将作为默认值使用
   */
  columns: TableColumnType<any>[]

  defaultColumnsState?: ColumnsState

  columnsState?: ColumnsState

  onColumnsStateChange?: (columnsState: ColumnsState) => void
  rewriteColumns?: (columns: TableColumnType<any>[]) => TableColumnType<any>[]
  meta?: Meta
} & AntTableProps<any>

new ClipboardJS(".js-copy-btn")

const SoulTable: React.ForwardRefRenderFunction<Handle, TableProps> = (
  {
    columns: propColumns,
    defaultColumnsState,
    columnsState: propColumnsState,
    onColumnsStateChange,
    meta: propMeta,
    dataSource: propDataSource,
    title,
    children,
    rewriteColumns,
    ...tableProps
  },
  ref
) => {
  const uuid = useId()
  const tableId = uuid.replace(/:/g, "")

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
  const [isOpenedCollapse, setIsOpenedCollapse] = useState(true)

  /** 当前点击的行数据 */
  const contextMenuRow = useRef<Record<string, string | number>>({})

  type Key = keyof ColumnState

  const setColumnState = useCallback(
    (colKey: string, key: Key, value: ColumnState[Key]) => {
      const newColumns = produce(columnsState, (draft) => {
        draft[colKey] = {
          ...draft[colKey],
          [key]: value,
        }
      })

      setColumnsState(newColumns)
    },

    [columnsState, setColumnsState]
  )

  const contextValue = useMemo(
    () => ({
      columnsState,
      setColumnsState,
      setColumnState,
      columns,
      meta,
    }),
    [columnsState, setColumnsState, setColumnState, columns, meta]
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
      .map((column) => {
        return {
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
        }
      })
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
            order: colKey === "drag" ? -1 : idx, // 让 drag 列总是位于第一列
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
      const bugRow = document.querySelector(".ant-table-measure-row")

      const first = bugRow ? fromIndex - 1 : fromIndex
      const to = bugRow ? toIndex - 1 : toIndex

      const moved = arrayMoveImmutable<any>(dataSource, first, to)

      setDateSource(moved)
    },
    handleSelector: ".drag-icon",
    nodeSelector: "tr.ant-table-row",
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

  return (
    <>
      <ColumnsStateContext.Provider value={contextValue}>
        <Row>
          <Col flex={1}>{title?.(dataSource)}</Col>
          <Col flex="none">
            {meta.toolbar === false ? null : (
              <Space
                style={{marginBottom: 8, marginLeft: "auto"}}
                size={"small"}
              >
                {meta.toolbar}
                {meta.disableSetting ? null : (
                  <Tooltip title="列配置">
                    <Button
                      type="text"
                      onClick={() => setIsOpenedSetting(true)}
                      size="small"
                      icon={<SettingOutlined />}
                    ></Button>
                  </Tooltip>
                )}

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
                <Tooltip title="复制">
                  <Button
                    type="text"
                    className="js-copy-btn"
                    data-clipboard-target={`#${tableId}`}
                    size="small"
                    icon={<CopyOutlined />}
                  />
                </Tooltip>
                {meta.disableCollapse ? null : (
                  <Tooltip title={isOpenedCollapse ? "收起" : "展开"}>
                    <Button
                      type="text"
                      onClick={() => setIsOpenedCollapse((o) => !o)}
                      size="small"
                      icon={
                        isOpenedCollapse ? <DownOutlined /> : <RightOutlined />
                      }
                    ></Button>
                  </Tooltip>
                )}
              </Space>
            )}
          </Col>
        </Row>

        <Collapse isOpened={isOpenedCollapse}>
          <ReactDragListView.DragColumn {...dragProps}>
            <ReactDragListView {...dragRowProps}>
              <Table
                id={tableId}
                columns={rewriteColumns?.(tableColumns) || tableColumns}
                onRow={(record) => {
                  return {
                    onContextMenu: () => {
                      contextMenuRow.current = record
                    },
                  }
                }}
                components={{
                  header: {
                    cell: ResizeableTitle,
                  },

                  ...(!isEmpty(dataSource) &&
                    !isEmpty(meta?.items) && {
                      body: {
                        row: (_props) => (
                          <Dropdown
                            menu={{
                              items: meta.items,
                              onClick: (menuInfo) => {
                                meta?.onItemClick?.({
                                  row: contextMenuRow.current,
                                  menuInfo,
                                })
                              },
                            }}
                            trigger={["contextMenu"]}
                          >
                            <tr {..._props} />
                          </Dropdown>
                        ),
                      },
                    }),
                }}
                dataSource={dataSource}
                {...tableProps}
              />
            </ReactDragListView>
          </ReactDragListView.DragColumn>
          {children}
        </Collapse>

        {
          // 列设置
          // 不能去除, 为了每次打开modal, useState重新执行
          isOpenedSetting && (
            <Suspense fallback={<Spin size="small"></Spin>}>
              <SettingModal
                columns={columns}
                open={isOpenedSetting}
                setIsOpenedSetting={setIsOpenedSetting}
                meta={meta}
              ></SettingModal>
            </Suspense>
          )
        }
        {
          // 导出 excel
          isOpenedExcel && (
            <Suspense fallback={<Spin size="small"></Spin>}>
              <ExcelModal
                columns={rewriteColumns?.(tableColumns) || tableColumns}
                dataSource={dataSource}
                open={isOpenedExcel}
                setIsOpenedExcel={setIsOpenedExcel}
                meta={meta}
              ></ExcelModal>
            </Suspense>
          )
        }
      </ColumnsStateContext.Provider>
    </>
  )
}

const ForwardTable = forwardRef(SoulTable)
const MemoTable = memo(ForwardTable)
export default MemoTable
