// Button.stories.ts|tsx

import {SoulSelect} from "@soul/core"
import type {Meta, StoryObj} from "@storybook/react"
import {useState} from "react"
import {options} from "./mockData"

const meta: Meta<typeof SoulSelect> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Components/Select",
  component: SoulSelect,
}

export default meta
type Story = StoryObj<typeof SoulSelect>

/**
 *
 * @param param0 [{label:'',value:[],mode:'',...}]
 * @returns
 */
const UnControlled = ({...rest}) => {
  const [value, setValue] = useState([])

  let storeKey = "preset_country"
  return (
    <SoulSelect
      value={value}
      style={{width: 300}}
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
    ></SoulSelect>
  )
}

const Controlled = ({...rest}) => {
  const [value, setValue] = useState([])
  const [mode, setMode] = useState("whereIn")

  console.log("mode", mode)
  console.log("value", value)
  return (
    <SoulSelect
      placeholder="受控模式"
      value={value}
      style={{width: 300}}
      soul={{
        mode: mode,
        onModeChange: setMode,
      }}
      onChange={setValue}
      {...rest}
    ></SoulSelect>
  )
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const UnControlledSelect: Story = {
  name: "非受控模式",
  render: () => <UnControlled options={options} />,
}

export const ControlledSelect: Story = {
  name: "受控模式",
  render: () => <Controlled options={options} />,
}
