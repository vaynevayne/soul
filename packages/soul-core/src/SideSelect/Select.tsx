import {DeleteOutlined, PlusOutlined} from "@ant-design/icons"
import {useUncontrolled} from "@soul/utils"
import {
  Select as AntSelect,
  SelectProps as AntSelectProps,
  Button,
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
  // {
  //   label: "匹配",
  //   value: "whereIn",
  // },
  {
    label: "反选",
    value: "whereNotIn",
  },
  {
    label: "包含",
    value: "like",
  },
  {
    label: "不包含",
    value: "notLike",
  },
]

type Mode = string

export type Preset = {
  label: string
  value: any
  mode: Mode
  [index: string]: any
}

export type SelectProps = AntSelectProps & {
  soul?: {
    defaultMode?: Mode
    optionsWidth?: number
    presetsWidth?: number
    mode?: Mode
    onModeChange?: (mode: Mode) => void
    modeList?: Array<{
      label: string
      value: Mode
      tooltip?: string
    }>

    presets?: Array<Preset>
    onDeletePreset?: (val: Preset) => void
    onAddPreset?: (params: Preset) => void
  }
}

const Select = ({soul = {}, value, onChange, ...other}: SelectProps) => {
  const {
    defaultMode = "whereIn",
    mode: propMode,
    optionsWidth,
    presetsWidth,
    presets = [],
    modeList = defaultModeList,
    onDeletePreset = () => {},
    onAddPreset = () => {},
    onModeChange = () => {},
  } = soul

  const [mode, setMode] = useUncontrolled({
    value: propMode,
    onChange: onModeChange,
    defaultValue: defaultMode,
    finalValue: "whereIn",
  })

  const onPresetClick = (preset) => {
    setMode(preset.mode)
    onChange?.(preset.value, preset)
  }

  return (
    <>
      <AntSelect
        mode={["like", "notLike"].includes(mode) ? "tags" : "multiple"}
        maxTagCount={"responsive"}
        allowClear
        value={value}
        onChange={onChange}
        suffixIcon={
          <span>{modeList.find((it) => it.value === mode)?.label}</span>
        }
        dropdownRender={(menu) => (
          <div>
            <div
              style={{
                display: "flex",
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <div style={{flexBasis: optionsWidth}}>{menu}</div>
              <div
                style={{
                  flex: "none",

                  flexBasis: presetsWidth,
                  // maxWidth: "20%",
                  display: "flex",
                  // overflow: "scroll",
                  borderInlineStart: "1px solid rgba(5, 5, 5, 0.06)",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1, // 让按钮全宽
                    flexDirection: "column",
                  }}
                >
                  {presets?.map((preset) => (
                    <Button
                      type="text"
                      key={preset.label}
                      size={"small"}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={() => onPresetClick(preset)}
                    >
                      <span
                        style={{
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {preset.label}
                      </span>

                      <DeleteOutlined
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          onDeletePreset(preset)
                        }}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Divider style={{margin: "4px 0"}} />
            <Space wrap>
              {modeList.map((item) => (
                <Tooltip title={item?.tooltip} key={item.value}>
                  <Checkbox
                    checked={mode === item.value}
                    onChange={(e) => {
                      setMode(e.target.checked ? item.value : "whereIn")
                    }}
                  >
                    {item.label}
                  </Checkbox>
                </Tooltip>
              ))}

              <Tooltip title="添加预设">
                <Button
                  type="text"
                  icon={<PlusOutlined />}
                  size={"small"}
                  onClick={async () => {
                    const presetLabel = window.prompt("预设名称")
                    if (!presetLabel) {
                      return
                    }

                    onAddPreset({
                      label: presetLabel.trim(),
                      value: value,
                      mode: mode as Mode,
                    })

                    // setLabelOpen(true)
                  }}
                ></Button>
              </Tooltip>
            </Space>
          </div>
        )}
        {...other}
      />
      {/* <Modal
        title="Title"
        open={isLabelOpen}
        onOk={async () => {
          await onAddPreset()
          setLabelOpen(false)
        }}
        onCancel={() => {
          setLabelOpen(false)
        }}
        zIndex={1051}
      >
        <Input
          size="small"
          placeholder="添加预设"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Modal> */}
    </>
  )
}

export default Select
