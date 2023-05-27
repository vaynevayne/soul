import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useUncontrolled } from "@soul/utils";
import {
  Select as AntSelect,
  SelectProps as AntSelectProps,
  Button,
  Checkbox,
  Divider,
  Input,
  Space,
  Tooltip,
} from "antd";
import { useState } from "react";

// 不需要传匹配
const defaultModeList: Array<{
  label: string;
  value: Mode;
  tooltip?: string;
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
];

type Mode = string;

type Preset = {
  label: string;
  value: any;
  mode: Mode;
  [index: string]: any;
};
export type SelectProps = AntSelectProps & {
  soul?: {
    defaultMode?: Mode;
    mode?: Mode;
    onModeChange?: (mode: Mode) => void;
    modeList?: Array<{
      label: string;
      value: Mode;
      tooltip?: string;
    }>;
    getPresets?: () => Promise<Array<Preset>>;
    deletePreset?: (val: Preset) => Promise<any>;
    addPreset?: (params: Preset) => Promise<any>;
  };
};

const Select = ({
  soul = {},
  onDropdownVisibleChange,
  value,
  ...other
}: SelectProps) => {
  const [mode, setMode] = useUncontrolled({
    value: soul.mode,
    onChange: soul.onModeChange,
    defaultValue: soul.defaultMode,
    finalValue: "whereIn",
  });

  console.log("Select:mode", mode);

  const [open, setOpen] = useState(true); // 浮层受控

  const [presets, setPresets] = useState<Array<Preset>>();
  const [label, setLabel] = useState<string>("");

  const modeList = soul.modeList || defaultModeList;

  /**
   *
   * @param visible 浮层展开时,再请求预设
   */
  const _onDropdownVisibleChange = async (visible) => {
    const _presets = await soul.getPresets?.();
    setPresets(_presets);
    setOpen(visible);
    onDropdownVisibleChange?.(visible);
  };
  const onDelete = async (preset: Preset) => {
    console.log("onDelete", preset);
    await soul.deletePreset?.(preset);
    const _presets = await soul.getPresets?.();
    setPresets(_presets);
  };

  const onAddPreset = async () => {
    if (!label) return;
    await soul.addPreset?.({
      label: label.trim(),
      value: value,
      mode: mode as Mode,
    });
    const _presets = await soul.getPresets?.();
    setPresets(_presets);
    setLabel("");
  };

  const onPresetClick = (preset) => {
    setMode(preset.mode);
    other?.onChange?.(preset.value, preset);
    setOpen(false);
  };

  return (
    <AntSelect
      mode={["like", "notLike"].includes(mode) ? "tags" : "multiple"}
      maxTagCount={"responsive"}
      style={{ width: "100%" }}
      allowClear
      value={value}
      open={open}
      onDropdownVisibleChange={_onDropdownVisibleChange}
      dropdownRender={(menu) => (
        <div
          style={{
            display: "flex",
          }}
        >
          <div
            style={{
              flex: "none",
              minWidth: 50,
              maxWidth: 120,
              display: "flex",
              borderInlineEnd: "1px solid rgba(5, 5, 5, 0.06)",
            }}
          >
            <div
              style={{
                padding: 8,
                display: "flex",
                flex: 1,
                flexDirection: "column",
                gap: 8,
              }}
            >
              {presets?.map((preset) => (
                <div
                  style={{ display: "flex", alignItems: "center" }}
                  key={preset.label}
                >
                  <Button
                    type="text"
                    key={preset.label}
                    size={"small"}
                    style={{ flex: 1, textAlign: "left" }}
                    onClick={() => onPresetClick(preset)}
                  >
                    {preset.label}
                  </Button>
                  <Button
                    type="text"
                    size={"small"}
                    icon={<DeleteOutlined onClick={() => onDelete(preset)} />}
                  ></Button>
                </div>
              ))}
              <Space style={{ marginTop: "auto" }}>
                <Input
                  size="small"
                  placeholder="添加预设"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
                <Tooltip title="将当前选中值及状态存在预设">
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    size={"small"}
                    onClick={onAddPreset}
                  ></Button>
                </Tooltip>
              </Space>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Space wrap>
              {modeList.map((item) => (
                <Tooltip title={item?.tooltip} key={item.value}>
                  <Checkbox
                    checked={mode === item.value}
                    onChange={(e) => {
                      setMode(e.target.checked ? item.value : "whereIn");
                    }}
                  >
                    {item.label}
                  </Checkbox>
                </Tooltip>
              ))}
            </Space>
          </div>
        </div>
      )}
      {...other}
    />
  );
};

export default Select;
