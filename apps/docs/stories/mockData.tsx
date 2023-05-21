// http://mockjs.com/examples.html#Random\.first\(\)

import { TableColumnsType } from "antd";
import { Random, mock } from "mockjs";
import React from "react";

export const columns: TableColumnsType = [
  {
    title: "",
    dataIndex: "drag",
    render: () => <span className="drag-icon">drag</span>,
  },
  {
    title: "name",
    dataIndex: "name",
  },
  {
    title: "age",
    dataIndex: "age",
  },
  {
    title: "email",
    dataIndex: "email",
  },
  {
    title: "address",
    dataIndex: "address",
  },
  {
    title: "date",
    dataIndex: "date",
  },
];
export const dataSource = Array(10)
  .fill(0)
  .map((item, idx) => ({
    id: idx,
    name: Random.cname(),
    age: Random.natural(1, 100),
    email: Random.email(),
    address: Random.county(true),
    date: mock("@datetime"),
  }));
