import { SoulTable } from "@soul/core";
import type { Meta, StoryObj } from "@storybook/react";
import { columns, dataSource } from "./mockData";
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Example/Table",
  component: SoulTable,
  tags: ["autodocs"],
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
} satisfies Meta<typeof SoulTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Uncontrolled: Story = {
  args: {
    dataSource,
    columns,
    rowKey: "id",
    defaultColumnsStateChange: {
      name: {
        order: 1,
      },
    },
    onColumnsStateChange: console.log,
  },
};

export const Controlled: Story = {
  args: {
    rowKey: "id",

    dataSource,
    columns,
    label: "Button",
  },
};

export const RowReorder: Story = {
  args: {
    rowKey: "id",

    dataSource,
    columns,
    size: "large",
    label: "Button",
  },
};

export const CustomVisibleModal: Story = {
  args: {
    rowKey: "id",

    dataSource,
    columns,
    size: "small",
    label: "Button",
  },
};
