import {Checkbox, Col, Divider, Row} from "antd"
import type {CheckboxChangeEvent} from "antd/es/checkbox"
import {produce} from "immer"
import {FC, useEffect, useState} from "react"
import {findColKey} from "./util"

// TODO radio group
const CheckAllSection: FC<any> = ({
  label,
  columns,
  localColumns,
  setLocaleColumns,
  radioGroup,
}) => {
  const [indeterminate, setIndeterminate] = useState(true)
  const [checkAll, setCheckAll] = useState(false)

  const isAllChecked = columns.every((col) => col.visible)
  const isAllUnChecked = columns.every((col) => !col.visible)

  useEffect(() => {
    setCheckAll(isAllChecked)
    setIndeterminate(!isAllUnChecked && !isAllChecked)
  }, [isAllChecked, isAllUnChecked])

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setIndeterminate(false)
    setCheckAll(e.target.checked)
    setLocaleColumns(
      produce(localColumns, (draft) => {
        columns.forEach((col) => {
          const idx = localColumns.findIndex(
            (item) => findColKey(item) === findColKey(col)
          )
          draft[idx].visible = e.target.checked
        })
      })
    )
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
        {columns.map((col) => (
          <Col span={8} key={findColKey(col)}>
            <Checkbox
              checked={col.visible}
              onChange={(e) => {
                const checked = e.target.checked
                const colKey = findColKey(col)
                const index = localColumns.findIndex(
                  (item) => findColKey(item) === colKey
                )
                setLocaleColumns(
                  produce(localColumns, (draft) => {
                    // 有互斥配置,且被包含 & 点击勾选
                    if (radioGroup && radioGroup.includes(colKey) && checked) {
                      // 全部改为 false, 包含当前
                      radioGroup.forEach((radioKey) => {
                        const idx = localColumns.findIndex(
                          (item) => findColKey(item) === radioKey
                        )
                        draft[idx].visible = false
                      })
                    }
                    // 更新当前的状态
                    draft[index].visible = checked
                    // if (draft[index]["tab"] === "维度") {
                    //   draft[index]["fixed"] = "left"
                    // }
                  })
                )
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
