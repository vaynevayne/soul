// Button.stories.ts|tsx

import {SoulSideSelect} from "@soul/core"
import type {Meta, StoryObj} from "@storybook/react"
import {useEffect, useState} from "react"
import {options} from "./mockData"

const meta: Meta<typeof SoulSideSelect> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/SideSelect",
  component: SoulSideSelect,
}

export default meta
type Story = StoryObj<typeof SoulSideSelect>

/**
 *
 * @param param0 [{label:'',value:[],mode:'',...}]
 * @returns
 */
const UnControlled = ({...rest}) => {
  const [value, setValue] = useState([])
  console.log("value", value)

  let storeKey = "preset_country"
  return (
    <SoulSideSelect
      style={{width: 200}}
      value={value}
      popupMatchSelectWidth={400}
      onChange={setValue}
      soul={{
        defaultMode: "whereIn",
        onModeChange: (mode) => {
          console.log("mode", mode)
        },
        getPresets: () => JSON.parse(localStorage.getItem(storeKey) || "[]"),
        deletePreset: async (val) => {
          const list = JSON.parse(localStorage.getItem(storeKey) || "[]")

          localStorage.setItem(
            storeKey,
            JSON.stringify(list.filter((item) => item.label !== val.label))
          )
        },
        addPreset: async (preset) => {
          console.log("addPreset", preset)

          const list = JSON.parse(localStorage.getItem(storeKey) || "[]")
          localStorage.setItem(storeKey, JSON.stringify(list.concat(preset)))
        },
      }}
      {...rest}
    ></SoulSideSelect>
  )
}

const Controlled = ({...rest}) => {
  const storeKey = "SideSelect"
  const [value, setValue] = useState([])
  const [mode, setMode] = useState("whereIn")

  console.log("mode", mode)
  console.log("value", value)
  useEffect(() => {
    console.log(
      "css",
      `.react-resizable-handle {
  position: absolute;
  top: 0px;
  bottom: 0px;
  height: 100%;
  width: 4px;
  border-right: 1px dashed rgb(44, 46, 51);
  cursor: col-resize;
}
.react-resizable-handle:hover {
  background-color: rgb(44, 46, 51);
}`
    )
  }, [])
  return (
    <SoulSideSelect
      // placement="bottomRight"
      popupMatchSelectWidth={300 + 100}
      style={{width: "100%"}}
      options={options}
      value={value}
      onChange={(...rest) => {
        if (value?.length === 1 && rest[0].length === 2) {
          if (["like", "notLike"].includes(mode)) {
            alert("只支持单选like,notLike")
            return
          }
        }

        setValue?.(rest[0])
      }}
      soul={{
        modeList: undefined,
        optionsWidth: 300,
        presetsWidth: 100,
        mode: mode,
        onModeChange: (nextMode) => {
          if (value?.length > 1 && ["like", "notLike"].includes(nextMode)) {
            alert("只支持单选like,notLike")
            return
          }
          setMode(nextMode)
        },
        // [{label: "a", value: "a", mode: "whereIn"}]
        presets: JSON.parse(localStorage.getItem(storeKey) || "[]"),
        onAddPreset: (preset) => {
          const list = JSON.parse(localStorage.getItem(storeKey) || "[]")
          localStorage.setItem(storeKey, JSON.stringify(list.concat(preset)))
        },
        onDeletePreset: (preset) => {
          const list = JSON.parse(localStorage.getItem(storeKey) || "[]")

          localStorage.setItem(
            storeKey,
            JSON.stringify(list.filter((item) => item.label !== preset.label))
          )
        },
      }}
    />
  )
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const UnControlledSideSelect: Story = {
  name: "非受控模式",
  render: () => <UnControlled options={options} />,
}

export const ControlledSideSelect: Story = {
  name: "受控模式",
  render: () => <Controlled options={options} />,
}
