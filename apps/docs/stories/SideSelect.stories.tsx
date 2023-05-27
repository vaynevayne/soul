// Button.stories.ts|tsx

import { SoulSideSelect } from "@soul/core";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { options } from "./mockData";

const meta: Meta<typeof SoulSideSelect> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/SideSelect",
  component: SoulSideSelect,
};

export default meta;
type Story = StoryObj<typeof SoulSideSelect>;

/**
 *
 * @param param0 [{label:'',value:[],mode:'',...}]
 * @returns
 */
const UnControlled = ({ ...rest }) => {
  const [value, setValue] = useState([]);
  console.log("value", value);

  let storeKey = "preset_country";
  return (
    <SoulSideSelect
      style={{ width: 200 }}
      value={value}
      popupMatchSelectWidth={400}
      onChange={setValue}
      soul={{
        defaultMode: "whereIn",
        onModeChange: (mode) => {
          console.log("mode", mode);
        },
        getPresets: () => JSON.parse(localStorage.getItem(storeKey) || "[]"),
        deletePreset: async (val) => {
          const list = JSON.parse(localStorage.getItem(storeKey) || "[]");

          localStorage.setItem(
            storeKey,
            JSON.stringify(list.filter((item) => item.label !== val.label))
          );
        },
        addPreset: async (preset) => {
          console.log("addPreset", preset);

          const list = JSON.parse(localStorage.getItem(storeKey) || "[]");
          localStorage.setItem(storeKey, JSON.stringify(list.concat(preset)));
        },
      }}
      {...rest}
    ></SoulSideSelect>
  );
};

const Controlled = ({ ...rest }) => {
  const [value, setValue] = useState([]);
  const [mode, setMode] = useState("whereIn");

  console.log("mode", mode);
  console.log("value", value);
  return (
    <SoulSideSelect
      placeholder="受控模式"
      value={value}
      soul={{
        mode: mode,
        onModeChange: setMode,
      }}
      onChange={setValue}
      {...rest}
    ></SoulSideSelect>
  );
};

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const UnControlledSideSelect: Story = {
  name: "非受控模式",
  render: () => <UnControlled options={options} />,
};

export const ControlledSideSelect: Story = {
  name: "受控模式",
  render: () => <Controlled options={options} />,
};
