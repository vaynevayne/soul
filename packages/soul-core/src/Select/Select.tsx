import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useUncontrolled } from "@soul/utils";
import {
  Select as AntSelect,
  SelectProps as AntSelectProps,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Input,
  MenuProps,
  Space,
  Tooltip,
} from "antd";
import { useState } from "react";

const flexBetweenStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

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

  const [open, setOpen] = useState(false); // 浮层受控

  const [presets, setPresets] = useState<Array<Preset>>();
  const [label, setLabel] = useState<string>("");
  const [isAddSuccess, setIsAddSuccess] = useState(false);
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
    setIsAddSuccess(true);
    setTimeout(() => {
      setIsAddSuccess(false);
    }, 2000);
  };

  const onPresetClick = (preset) => {
    setMode(preset.mode);
    other?.onChange?.(preset.value, preset);
    setOpen(false);
  };

  const items: MenuProps["items"] =
    presets?.map((preset) => ({
      key: preset.label,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={() => onPresetClick(preset)}
        >
          {preset.label}
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.preventDefault();
              onDelete(preset);
            }}
          ></Button>
        </div>
      ),
    })) || [];

  return (
    <AntSelect
      mode={["like", "notLike"].includes(mode) ? "tags" : "multiple"}
      maxTagCount={"responsive"}
      allowClear
      value={value}
      open={open}
      onDropdownVisibleChange={_onDropdownVisibleChange}
      dropdownRender={(menu) => (
        <>
          <div style={flexBetweenStyle}>
            <Dropdown menu={{ items }}>
              <a onClick={(e) => e.preventDefault()} style={{ marginLeft: 8 }}>
                <Space wrap={false}>预设</Space>
              </a>
            </Dropdown>

            <Input
              placeholder="名称"
              size="small"
              style={{ maxWidth: 150, marginLeft: "auto" }}
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
              }}
            />
            <Button
              type={isAddSuccess ? "link" : "text"}
              size="small"
              icon={isAddSuccess ? <CheckOutlined /> : <PlusOutlined />}
              onClick={onAddPreset}
            ></Button>
          </div>

          <Divider style={{ margin: "8px 0" }} />
          {menu}

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
        </>
      )}
      {...other}
    />
  );
};

export default Select;
