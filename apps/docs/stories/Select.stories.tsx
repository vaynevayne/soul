// Button.stories.ts|tsx

import {SoulSelect, SoulSelectProps} from "@soul/core"
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

/*
 * Example Button story with React Hooks.
 * See note below related to this example.
 */
const UnControlled = ({...rest}) => {
  const [value, setValue] = useState([])
  console.log("value", value)
  return <SoulSelect value={value} onChange={setValue} {...rest}></SoulSelect>
}

const Controlled = ({...rest}) => {
  const [value, setValue] = useState([])
  const [sMode, setSMode] = useState<SoulSelectProps["sMode"]>("whereIn")

  console.log("sMode", sMode)
  console.log("value", value)
  return (
    <SoulSelect
      placeholder="受控模式"
      value={value}
      onChange={setValue}
      sMode={sMode}
      onSModeChange={setSMode}
      sModeList={[
        {
          label: "反选",
          value: "whereNotIn",
        },
      ]}
      {...rest}
    ></SoulSelect>
  )
}

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const UnControlledMode: Story = {
  name: "非受控模式",
  render: () => <UnControlled options={options} />,
}

export const ControlledMode: Story = {
  name: "受控模式",
  render: () => <Controlled options={options} />,
}
