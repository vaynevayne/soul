import {SoulTable} from "@soul/core"
import type {Meta, StoryObj} from "@storybook/react"
import "react-contexify/dist/ReactContexify.css"
import "react-resizable/css/styles.css"
import {columns, dataSource} from "./mockData"

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Components/Table",
  component: SoulTable,
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component: "https://github.com/nkbt/react-collapse",
      },
    },
  },
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} satisfies Meta<typeof SoulTable>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Uncontrolled: Story = {
  args: {
    dataSource,
    columns,
    rowKey: "id",
    defaultColumnsState: {
      name: {
        order: 1,
      },
    },
    onColumnsStateChange: console.log,
  },
}

export const Controlled: Story = {
  args: {
    rowKey: "id",

    dataSource,
    columns,
  },
}

export const RowReorder: Story = {
  args: {
    rowKey: "id",

    dataSource,
    columns,
    size: "large",
  },
}

export const CustomVisibleModal: Story = {
  args: {
    rowKey: "id",
    dataSource,
    columns,
    size: "small",
  },
}

export const CollapseTable: Story = {
  parameters: {
    docs: {
      title: "1212",
      description: {
        story: "https://github.com/nkbt/react-collapse",
      },
    },
  },
  args: {
    rowKey: "id",
    dataSource,
    columns,
    size: "small",
  },
}
