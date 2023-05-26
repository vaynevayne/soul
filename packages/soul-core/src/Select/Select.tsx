import {useUncontrolled} from "@soul/utils"
import {
  Select as AntSelect,
  SelectProps as AntSelectProps,
  Checkbox,
  Divider,
  Space,
  Tooltip,
} from "antd"

// 不需要传匹配
const defaultModeList: Array<{
  label: string
  value: Mode
  tooltip?: string
}> = [
  {
    label: "包含",
    value: "like",
  },
  {
    label: "不包含",
    value: "notLike",
  },
  // {
  //   label:'匹配',
  //   value:'whereIn'
  // },
  {
    label: "反选",
    value: "whereNotIn",
  },
]

type Mode = "like" | "notLike" | "whereIn" | "whereNotIn"

export type SelectProps = AntSelectProps & {
  sMode?: Mode
  onSModeChange?: (mode: Mode) => void
  sModeList?: Array<{
    label: string
    value: Mode
    tooltip?: string
  }>
}

const Select = ({
  sMode: propSMode,
  onSModeChange,
  sModeList: propSModeList,
  ...other
}: SelectProps) => {
  const sModeList = propSModeList || defaultModeList
  const [sMode, setSMode] = useUncontrolled({
    value: propSMode,
    onChange: onSModeChange,
    defaultValue: "whereIn",
  })
  return (
    <AntSelect
      mode={["like", "notLike"].includes(sMode) ? "tags" : "multiple"}
      maxTagCount={"responsive"}
      style={{width: "100%"}}
      allowClear
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{margin: "8px 0"}} />
          <Space style={{padding: "0 8px 4px"}}>
            {sModeList.map((item) => (
              <Tooltip title={item?.tooltip} key={item.value}>
                <Checkbox
                  checked={sMode === item.value}
                  onChange={(e) => {
                    setSMode(e.target.checked ? item.value : "whereIn")
                  }}
                >
                  {item.label}
                </Checkbox>
              </Tooltip>
            ))}
          </Space>
        </>
      )}
      {...other}
    />
  )
}

export default Select
