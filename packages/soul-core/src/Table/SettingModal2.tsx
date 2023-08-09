import {CloseOutlined, MenuOutlined, SearchOutlined} from "@ant-design/icons"
import {Col, Divider, Input, Modal, ModalProps, Row, Space, Tabs} from "antd"
import {arrayMoveImmutable} from "array-move"
import {produce} from "immer"
import {groupBy, omit} from "lodash-es"
import {FC, memo, useContext, useEffect, useMemo, useState} from "react"
import ReactDragListView from "react-drag-listview"
import CheckAllSection from "./CheckAllSection"
import {ColumnsStateContext} from "./context"
import {ColumnWithState} from "./type"
import {findColKey, getSorter, mapStateToColumns} from "./util"

// 所有 collapse 数组的去重
const getCollapseLabels = (tabColumns: any[]): string[] => [
  ...new Set(tabColumns.map((item) => item.collapse).flat()),
]

export type SettingModal2Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  radioGroup?: string[]
} & ModalProps

const SettingModal2: FC<SettingModal2Props> = ({
  open,
  onOpenChange,
  radioGroup,
}) => {
  const {columns, meta, ...context} = useContext(ColumnsStateContext)

  const [columnsState, setColumnsState] = useState(context.columnsState)

  useEffect(() => {
    if (open) {
      setColumnsState(context.columnsState)
    }
  }, [context.columnsState, open])

  const [searchValue, setSearchValue] = useState("")

  const localColumns = useMemo(() => {
    return mapStateToColumns(columns, columnsState, !!meta.defaultVisible)
  }, [columns, columnsState, meta.defaultVisible])

  // 从 columnsState  派生状态

  const leftColumns = useMemo(() => {
    return mapStateToColumns(columns, columnsState, !!meta.defaultVisible)
      .sort(getSorter(columnsState))

      .filter((item) => item.visible)
      .filter((item) => item.fixed === "left")
      .map((item) => ({
        ...item,
        id: item.id ?? findColKey(item),
        name: item.title,
      }))
  }, [columns, columnsState, meta.defaultVisible])

  const centerColumns = useMemo(() => {
    return mapStateToColumns(columns, columnsState, !!meta.defaultVisible)
      .sort(getSorter(columnsState))

      .filter((item) => item.visible)
      .filter((item) => item.fixed !== "left")
      .map((item) => ({
        ...item,
        id: item.id ?? findColKey(item),
        name: item.title,
      }))
  }, [columns, columnsState, meta.defaultVisible])

  const onOk = () => {
    meta?.settingModalProps?.onOk?.(columnsState) // 由onOk 来修改
    // context.setColumnsState(columnsState)
    onOpenChange(false)
  }

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const moved = arrayMoveImmutable<ColumnWithState>(
        leftColumns,
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
    nodeSelector: ".li",
    handleSelector: ".handle",
  }

  const dragProps2 = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const moved = arrayMoveImmutable<ColumnWithState>(
        centerColumns,
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
    nodeSelector: ".li",
    handleSelector: ".handle",
    // scrollSpeed: 200,
    enableScroll: false,
  }

  return (
    <Modal
      width={800}
      open={open}
      title="列设置"
      onOk={onOk}
      onCancel={() => onOpenChange(false)}
      // {...modalProps}
    >
      <Divider></Divider>
      <Row wrap={false} gutter={{xs: 8, sm: 16, md: 24}}>
        <Col span={18}>
          <Input
            allowClear
            placeholder="请输入列名称"
            suffix={<SearchOutlined style={{color: "rgba(0,0,0,.45)"}} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value.trim())}
            style={{
              marginBottom: 16,
            }}
          />
          <Tabs
            defaultActiveKey="指标"
            type="card"
            size={"small"}
            items={Object.entries(groupBy(localColumns, "tab")).map(
              ([tab, tabColumns]) => ({
                label: tab,
                key: tab,
                children: (
                  <div
                    style={{
                      overflowY: "scroll",
                      maxHeight: 400,
                    }}
                  >
                    <Space
                      direction="vertical"
                      size={16}
                      style={{width: "100%"}}
                    >
                      {getCollapseLabels(tabColumns)
                        .sort((a, b) =>
                          meta.collapseOrder?.[tab]
                            ? meta.collapseOrder?.[tab].indexOf(a) -
                              meta.collapseOrder?.[tab].indexOf(b)
                            : 0
                        )
                        .map((label) => (
                          <CheckAllSection
                            label={label}
                            key={label}
                            columnsState={columnsState}
                            setColumnsState={setColumnsState}
                            radioGroup={radioGroup}
                            chunkColumns={tabColumns
                              .filter((col) => col.collapse.includes(label))
                              .filter((col) =>
                                typeof col.title === "function"
                                  ? String(col.title({})).includes?.(
                                      searchValue
                                    )
                                  : String(col.title).includes(searchValue) ||
                                    String(col.dataIndex).includes(searchValue)
                              )}
                          ></CheckAllSection>
                        ))}
                    </Space>
                  </div>
                ),
              })
            )}
          />
        </Col>
        <Col
          span={6}
          style={{
            border: "1px  dashed hsl(220deg 13.04% 90.98%)",
            borderRadius: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>已选择{leftColumns.length + centerColumns.length}列</span>
            <a
              className="mt-1"
              onClick={(e) => {
                e.preventDefault()

                setColumnsState(
                  produce(columnsState, (draft) => {
                    Object.entries(columnsState).forEach(([field, state]) => {
                      draft[field] = omit(
                        {
                          ...draft[field],
                          visible: false,
                        },
                        ["sortOrder"]
                      )
                    })
                  })
                )
              }}
            >
              清空
            </a>
          </div>
          <Divider plain dashed style={{color: "#999999", fontSize: 12}}>
            维度
          </Divider>

          <ReactDragListView {...dragProps}>
            {leftColumns.map((column, index) => (
              <SortItem
                title={column.title}
                key={index}
                onDelete={() => {
                  setColumnsState(
                    produce(columnsState, (draft) => {
                      const colKey = findColKey(column)
                      draft[colKey] = {
                        ...draft[colKey],
                        visible: false,
                      }
                    })
                  )
                }}
              />
            ))}
          </ReactDragListView>

          <Divider plain dashed style={{color: "#999999", fontSize: 12}}>
            指标
          </Divider>
          <div
            style={{maxHeight: 350, overflowY: "auto"}}
            className="scroll-shadow"
          >
            <ReactDragListView {...dragProps2}>
              {centerColumns.map((column, index) => (
                <SortItem
                  title={column.title}
                  key={index}
                  onDelete={() => {
                    setColumnsState(
                      produce(columnsState, (draft) => {
                        const colKey = findColKey(column)
                        draft[colKey] = {
                          ...draft[colKey],
                          visible: false,
                        }
                      })
                    )
                  }}
                />
              ))}
            </ReactDragListView>
          </div>
        </Col>
      </Row>
    </Modal>
  )
}

const SortItem = ({title, onDelete}) => {
  return (
    <div
      className="li"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "4px 8px",
        border: "1px solid rgba(5, 5, 5, 0.06)",
        borderRadius: 4,
        margin: "4px 0",
      }}
    >
      <MenuOutlined
        className="handle"
        style={{cursor: "move", marginRight: 8}}
      />
      <span style={{flex: 1}}> {title}</span>
      <CloseOutlined onClick={onDelete} />
    </div>
  )
}
export default memo(SettingModal2)
