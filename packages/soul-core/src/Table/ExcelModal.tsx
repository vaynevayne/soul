import { asyncExportTableData, formatAntTable } from '@soul/utils';
import { Divider, Input, Modal, ModalProps } from 'antd';
import {
  ChangeEvent,
  Dispatch,
  FC,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ColumnWithState, Meta } from './type';

export type ExcelModalProps = {
  columns: ColumnWithState[];
  meta: Meta;
  setIsOpenedExcel: Dispatch<boolean>;
  dataSource: any[];
} & ModalProps;

const ExcelModal: FC<ExcelModalProps> = ({
  meta,
  setIsOpenedExcel,
  columns,
  dataSource: propDataSource,
  ...modalProps
}) => {
  const dataSource = useMemo(() => propDataSource || [], [propDataSource]);

  const [filename, setFilename] = useState(meta.filename || 'my-excel');

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilename(e.target.value.trim()),
    [],
  );

  const onDownload = async () => {
    if (!dataSource) return;

    /**
     * 按照 columns 的顺序导出
     */
    await asyncExportTableData(
      columns?.map?.((item) => ({ ...item, field: item.dataIndex })),
      formatAntTable(dataSource, columns),
      filename,
    );
  };

  const onOk = () => {
    onDownload();
    setIsOpenedExcel(false);
  };

  return (
    <Modal
      title="导出Excel"
      onOk={onOk}
      onCancel={() => setIsOpenedExcel(false)}
      {...modalProps}
    >
      <Input value={filename} onChange={onChange} placeholder="文件名"></Input>
      <Divider />
    </Modal>
  );
};

export default memo(ExcelModal);
