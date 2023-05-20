import * as Excel from 'exceljs';
import { get, isEmpty } from 'lodash-es';
// eslint-disable-next-line @typescript-eslint/no-unused-vars

const cellBorderStyle = {
  style: 'thin',
  color: { argb: 'FFAEA1C5' },
};

const formatAntTable = (data, columns) => {
  const resTable = <any>[];
  if (!data) {
    return [];
  }

  data.forEach((row) => {
    const newRow = {};
    columns.forEach((col) => {
      let value = get(row, col.dataIndex);
      if (col.render) {
        value =
          typeof col.render?.(value, row) === 'object'
            ? value
            : col.render?.(value, row);
      }

      newRow[col.dataIndex] = value;
    });
    resTable.push(newRow);
  });

  return resTable;
};

function downloadExcel(workbook, fileName) {
  workbook.xlsx.writeBuffer({ useStyles: true }).then((data) => {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    // eslint-disable-next-line no-param-reassign
    if (!fileName.endsWith('.xlsx')) fileName += '.xlsx';
    anchor.download = fileName;
    anchor.click();
    window.URL.revokeObjectURL(url);
  });
}

function exportExcel(Excel, tableColumns, tableData, lines, fileName) {
  const formatMap = {
    rate: '0.00%',
    money: '$0.00',
    int: '0',
    string: '@',
  };
  // 创建工作簿{#create-a-workbook}
  const workbook = new Excel.Workbook();
  // 设置工作簿属性
  workbook.creator = 'EMA鹰眼2.0系统';
  // 创建工作表
  const worksheet = workbook.addWorksheet(fileName, {
    properties: {
      tabColor: { argb: 'ffeaff8f' },
      defaultRowHeight: 20,
    },
  });
  // 添加列标题并定义列键和宽度
  // 注意：这些列结构只是工作簿构建方便，
  // 除了列宽之外，它们不会完全持久化。

  worksheet.columns = tableColumns.map((column) => ({
    header: column.title || column.headerName,
    key: column.dataIndex || column.field,
    width: (column.width || 100) / 7,
    height: 70,
    style: {
      font: {
        size: 12,
        bold: true,
      },
      alignment: {
        vertical: 'middle',
        horizontal: column.oldType === 'string' ? 'left' : 'right',
      },
      numFmt: formatMap[column.oldType] || 'General',
    },
  }));

  // 冻结表格
  const ySplit = tableData.filter((item) => item.total_row).length + 1;
  worksheet.views = [
    {
      state: 'frozen',
      xSplit: tableColumns.filter((item) => item.fixedColumn).length,
      ySplit,
    },
  ];
  lines.forEach((line, index) => {
    const row = worksheet.addRow(line);
    row.eachCell({ includeEmpty: true }, (cell) => {
      const isTotalRow = index + 1 >= ySplit;
      if (isTotalRow) {
        // eslint-disable-next-line no-param-reassign
        cell.font = {
          bold: false,
          size: 12,
        };
      }
      // 隔行变色
      if (index % 2 === 0) {
        // eslint-disable-next-line no-param-reassign
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: isTotalRow ? 'FFF7F1FD' : 'FFF6D6B9' },
        };
        // eslint-disable-next-line no-param-reassign
        cell.border = {
          top: cellBorderStyle,
          bottom: cellBorderStyle,
          left: cellBorderStyle,
          right: cellBorderStyle,
        };
      }
    });
    // row.commit();
  });
  downloadExcel(workbook, fileName);
}

async function asyncExportTableData(tableColumns, tableData, fileName) {
  if (isEmpty(tableData)) {
    return;
  }


  exportExcel(Excel, tableColumns, tableData, tableData, fileName);
}

export {
  asyncExportTableData,
  formatAntTable,
};

