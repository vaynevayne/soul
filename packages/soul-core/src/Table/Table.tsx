import { useUncontrolled, useWatch } from "@soul/utils";
import {
  TableProps as AntTableProps,
  Button,
  Col,
  Row,
  Space,
  Table,
  TableColumnType,
} from "antd";
import { arrayMoveImmutable } from "array-move";
import { produce } from "immer";
import {
  Dispatch,
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Item, Menu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import ReactDragListView from "react-drag-listview";
import "react-resizable/css/styles.css";
import ExcelModal from "./ExcelModal";
import { ResizeableTitle } from "./ResizeableTitle";
import SettingModal from "./SettingModal";
import { ColumnsStateContext } from "./context";
import {
  ColumnState,
  ColumnWithState,
  ColumnsState,
  Meta,
  SoulTableColumn,
} from "./type";
import { findColKey, getSorter, getState, getVisible } from "./util";

export type TableProps = {
  /**
   * @description 可以在 column 中传入相关 columnState, 将作为默认值使用
   */
  columns: SoulTableColumn[];

  defaultColumnsState?: ColumnsState;

  columnsState?: ColumnsState;

  onColumnsStateChange?: Dispatch<ColumnsState>;

  meta?: Meta;
} & AntTableProps<any>;

const MENU_ID = "menu-id";

const SoulTable: FC<TableProps> = ({
  columns: propColumns,
  defaultColumnsState,
  columnsState: propColumnsState,
  onColumnsStateChange,
  meta: propMeta,
  dataSource: propDataSource,
  ...tableProps
}) => {
  // 函数参数默认值对 null 无效,所以在这里写引用类型默认值
  const columns = useMemo(() => propColumns || [], [propColumns]);
  const meta = useMemo(
    () => ({
      defaultVisible: true,
      ...propMeta,
    }),
    [propMeta]
  );
  const [dataSource, setDateSource] = useState<any[]>([]);

  useWatch(
    propDataSource,
    (newVal) => {
      console.log("newVal", newVal);

      setDateSource([...(newVal || [])]);
    },
    { immediate: true }
  );

  const [columnsState, setColumnsState] = useUncontrolled<ColumnsState>({
    value: propColumnsState,
    defaultValue: defaultColumnsState,
    finalValue: {},
    onChange: onColumnsStateChange,
  });

  const [isOpenedSetting, setIsOpenedSetting] = useState(false);
  // excel modal
  const [isOpenedExcel, setIsOpenedExcel] = useState(false);

  // 🔥 you can use this hook from everywhere. All you need is the menu id
  const { show } = useContextMenu({
    id: MENU_ID,
  });

  type Key = keyof ColumnState;

  const setColumnState = useCallback(
    (colKey: string, key: Key, value: ColumnState[Key]) => {
      console.log("log:setColumnState", colKey, key, value);

      console.log("prev", JSON.stringify(columnsState));
      const newColumns = produce(columnsState, (draft) => {
        draft[colKey] = {
          ...draft[colKey],
          [key]: value,
        };
      });

      console.log("newColumns", JSON.stringify(newColumns));

      setColumnsState(newColumns);
    },

    [columnsState, setColumnsState]
  );

  const contextValue = useMemo(
    () => ({
      columnsState,
      setColumnsState,
      setColumnState,
    }),
    [columnsState, setColumnsState, setColumnState]
  );

  const [, setIsResizing] = useState(false);

  const onResizeStart = (e) => {
    console.log("start resize");
    setIsResizing(true);

    e.stopPropagation();
    e.preventDefault();
  };

  const onResizeStop = () => {
    console.log("end resize");
    setIsResizing(false);
  };

  const handleResize = useCallback(
    (column: TableColumnType<any>) =>
      (_, { size }) => {
        const colKey = findColKey(column);
        console.log("size", size);

        setColumnState(colKey, "width", size.width);
      },
    [setColumnState]
  );

  console.log("render", columnsState);

  useEffect(() => {
    console.log("columnsState:useEffect", columnsState);
  }, [columnsState]);

  const tableColumns = useMemo<any>(() => {
    console.log("useMemo", columnsState);

    return columns
      .filter(Boolean)
      .sort(getSorter(columnsState))
      .filter(getVisible(columnsState, meta.defaultVisible))
      .map((column) => ({
        ...column,
        width: getState(columnsState, column)?.width || column.width,
        onHeaderCell: (column) => ({
          width: getState(columnsState, column)?.width || column.width,
          onResize: handleResize(column),
          onResizeStart: onResizeStart,
          onResizeStop: onResizeStop,
        }),
      }));
  }, [columns, columnsState, handleResize, meta.defaultVisible]);

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const moved = arrayMoveImmutable<ColumnWithState>(
        tableColumns,
        fromIndex,
        toIndex
      );

      const newColumnsState = produce(columnsState, (draft) => {
        moved.forEach((col, idx) => {
          const colKey = findColKey(col);
          draft[colKey] = {
            ...draft[colKey],
            order: idx,
          };
        });
      });

      setColumnsState(newColumnsState);
    },
    nodeSelector: "th",
    ignoreSelector: ".ant-table-cell-fix-left",
  };

  const dragRowProps = {
    onDragEnd(fromIndex, toIndex) {
      const moved = arrayMoveImmutable<any>(dataSource, fromIndex, toIndex);
      setDateSource(moved);
    },
    handleSelector: ".drag-icon",
    // nodeSelector: 'tr.ant-table-row',
  };

  console.log("tableColumns", tableColumns);
  console.log("dataSource", dataSource);

  return (
    <>
      <ColumnsStateContext.Provider value={contextValue}>
        <Row wrap={false}>
          <Col flex={1}></Col>
          <Col flex="none">
            <Space style={{ marginBottom: 8, marginLeft: "auto" }}>
              <Button onClick={() => setIsOpenedSetting(true)}>列设置</Button>
              <Button onClick={() => setIsOpenedExcel(true)}>excel</Button>
            </Space>
          </Col>
        </Row>

        <ReactDragListView.DragColumn {...dragProps}>
          <ReactDragListView {...dragRowProps}>
            <Table
              columns={tableColumns}
              onRow={(record) => {
                return {
                  onContextMenu: (event) => {
                    show({
                      event,
                      props: record,
                    });
                  },
                };
              }}
              components={{
                header: {
                  cell: ResizeableTitle,
                },
              }}
              dataSource={dataSource}
              {...tableProps}
            />
          </ReactDragListView>
        </ReactDragListView.DragColumn>

        {
          // 列设置
          // 不能去除, 为了每次打开modal, useState重新执行
          isOpenedSetting && (
            <SettingModal
              columns={columns}
              open={isOpenedSetting}
              setIsOpenedSetting={setIsOpenedSetting}
              meta={meta}
            ></SettingModal>
          )
        }
        {
          // 导出 excel
          isOpenedExcel && (
            <ExcelModal
              columns={columns}
              dataSource={dataSource}
              open={isOpenedExcel}
              setIsOpenedExcel={setIsOpenedExcel}
              meta={meta}
            ></ExcelModal>
          )
        }

        {/* 右键菜单 */}
        {meta.contextMenus?.length && (
          <Menu id={MENU_ID}>
            {meta.contextMenus.map((item, index) => (
              <Item
                key={item.key || index}
                onClick={meta.handleItemClick}
                {...item}
              >
                {item.children}
              </Item>
            ))}
          </Menu>
        )}
      </ColumnsStateContext.Provider>
    </>
  );
};

const MemoTable = memo(SoulTable);
export default MemoTable;
