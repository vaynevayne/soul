import {Checkbox, Col, Divider, Row} from "antd"
import type {CheckboxChangeEvent} from "antd/es/checkbox"
import {produce} from "immer"
import {FC, useContext, useEffect, useState} from "react"
import {ColumnsStateContext} from "./context"
import {findColKey, findMaxOrder} from "./util"

// TODO radio group
const CheckAllSection: FC<any> = ({
  label,
  chunkColumns,
  localColumns,
  radioGroup,
}) => {
  const {columnsState, setColumnsState} = useContext(ColumnsStateContext)
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const isAllChecked = chunkColumns.every((col) => col.visible)
  const isAllUnChecked = chunkColumns.every((col) => !col.visible)

  useEffect(() => {
    setCheckAll(isAllChecked)
    setIndeterminate(!isAllUnChecked && !isAllChecked)
  }, [isAllChecked, isAllUnChecked])

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    const [maxLeftOrder, maxCenterOrder] = findMaxOrder(columnsState)
    setColumnsState(
      produce(columnsState, (draft) => {
        chunkColumns.forEach((col, index) => {
          const colKey = findColKey(col)
          // 好像不要也行
          const fromHideToVisible = !draft[colKey]?.visible && e.target.checked

          draft[colKey] = {
            ...draft[colKey],
            visible: e.target.checked,
            fixed: col.tab === "维度" ? "left" : false,
            // 从 hide 到 visible 递增 order
            // 从 visible 到 hide,不修改 order
            ...(fromHideToVisible && {
              order:
                col.tab === "维度"
                  ? maxLeftOrder + index + 1
                  : maxCenterOrder + index + 1,
            }),
          }
        })
      })
    )

    // setLocaleColumns(
    //   produce(localColumns, (draft) => {
    //     chunkColumns.forEach((col) => {
    //       const idx = localColumns.findIndex(
    //         (item) => findColKey(item) === findColKey(col)
    //       )
    //       draft[idx].visible = e.target.checked
    //     })
    //   })
    // )
  }

  return (
    <>
      {label ? (
        <Divider orientation="left" plain>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            {label || "全选"}
          </Checkbox>
        </Divider>
      ) : null}

      <Row>
        {chunkColumns.map((col) => (
          <Col span={8} key={findColKey(col)}>
            <Checkbox
              checked={col.visible}
              onChange={(e) => {
                const checked = e.target.checked
                const colKey = findColKey(col)

                const [maxLeftOrder, maxCenterOrder] =
                  findMaxOrder(columnsState)

                setColumnsState(
                  produce(columnsState, (draft) => {
                    //  有互斥配置,且被包含 & 点击勾选
                    if (radioGroup && radioGroup.includes(colKey) && checked) {
                      // 全部改为 false, 包含当前
                      radioGroup.forEach((radioKey) => {
                        draft[radioKey] = {
                          ...draft[radioKey],
                          visible: false,
                        }
                      })
                    }
                    // 重写当前值
                    draft[colKey] = {
                      ...draft[colKey],
                      visible: checked,
                      fixed: col.tab === "维度" ? "left" : false,
                      ...(checked && {
                        order:
                          col.tab === "维度"
                            ? maxLeftOrder + 1
                            : maxCenterOrder + 1,
                      }),
                    }
                  })
                )
                // setLocaleColumns(
                //   produce(localColumns, (draft) => {
                //     // 有互斥配置,且被包含 & 点击勾选
                //     if (radioGroup && radioGroup.includes(colKey) && checked) {
                //       // 全部改为 false, 包含当前
                //       radioGroup.forEach((radioKey) => {
                //         const idx = localColumns.findIndex(
                //           (item) => findColKey(item) === radioKey
                //         )
                //         draft[idx].visible = false
                //       })
                //     }
                //     // 更新当前的状态
                //     draft[index].visible = checked

                //   })
                // )
              }}
            >
              {typeof col.title === "function" ? col.title({}) : col.title}
            </Checkbox>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default CheckAllSection
