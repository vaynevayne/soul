import { TableColumnType } from 'antd';
import { Dispatch, Key, ReactNode, SetStateAction } from 'react';
import { ItemParams } from 'react-contexify';

export type ColumnState = {
  order?: number;
  visible?: boolean;
  disabled?: boolean;
  width?: number;
};

export type ColumnsState = Record<string, ColumnState>;

export type ColumnWithState = TableColumnType<any> & ColumnState;

export type Meta = {
  /**
   * 导出 excel 的默认文件名
   */
  filename?: string;
  /**
   * 默认状态下,所有列的显示情况
   */
  defaultVisible?: boolean;

  /**
   * 右键菜单, label用做渲染, 其他属性会传到 handleItemClick 里
   */
  contextMenus?: {
    key?: Key;
    children: ReactNode;
    onClick?: (params: ItemParams<Record<string, any>, any>) => void;
    data?: Record<string, any>;
  }[];
  /**
   * 右键菜单被点击时
   */
  handleItemClick?: (params: ItemParams<Record<string, any>, any>) => void;

  /**
   * 当 checked 被点击时调用,如果传入则需要自己处理 setState,以便支持更复杂的联动
   * @param checked
   * @param setLocalColumns
   * @param index
   * @param column
   * @example onCheckboxChange(checked,setLocalColumns){
   *    setLocalColumns(localColumns=>
   *                     produce(localColumns, (draft) => {
   *                       draft[index].visible = checked;
   *                     }),
   *                   );
   * }
   */
  onCheckboxChange?(
    checked: boolean,
    setLocalColumns: Dispatch<SetStateAction<any>>,
    index: number,
    column: ColumnWithState,
  ): void;
};
