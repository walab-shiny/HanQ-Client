import ExcelJS from 'exceljs';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import Iconify from '../../../components/iconify';
import { fDateString, fTimeString } from '../../../utils/formatTime';

function excel(data, event) {
  const filename = `${event.name} 참여자 명단.xlsx`;
  const duration = `${fDateString(event.openAt)} ~ ${fTimeString(event.closeAt)}`;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('참여자 명단');

  worksheet.addRow([]);

  // Set title
  const titleRow = worksheet.addRow(['']);
  titleRow.height = 30; // Set height of the first row to 30
  const titleCell = titleRow.getCell(2); // Add an empty cell on the left side
  titleCell.value = event.name;
  titleCell.font = { bold: true, size: 16, underline: true };
  titleCell.alignment = { vertical: 'middle' };

  const durationRow = worksheet.addRow(['', '', '', '일시:', duration]);
  durationRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };
  const durationCell = durationRow.getCell(5);
  durationCell.alignment = { vertical: 'middle', horizontal: 'right' };

  // Set column headers
  const columnHeaderRow = worksheet.addRow(['', '학부', '학번', '이름', '태깅시간']);
  columnHeaderRow.font = { bold: true, underline: true };
  columnHeaderRow.alignment = { vertical: 'middle' };

  // Set data rows
  const dataStartRow = 5; // Start the data rows two rows below the title
  data.forEach((item) => {
    const rowData = ['', item.department, item.studentNum, item.name, fDateString(item.taggedAt)]; // Add an empty cell on the left side
    worksheet.addRow(rowData);
  });

  // Apply cell formatting to column headers
  columnHeaderRow.eachCell((cell, colNumber) => {
    if (colNumber === 1) return;
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2065D1' }, // Primary color
    };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle' };
  });

  // Apply cell formatting to data rows
  const dataRows = worksheet.getRows(dataStartRow, worksheet.rowCount - dataStartRow + 1);
  dataRows.forEach((row, index) => {
    row.getCell(3).alignment = { horizontal: 'left' };

    if (index % 2 === 0) {
      // Apply zebra striping to data rows
      row.eachCell((cell, colNumber) => {
        if (colNumber === 1) return;
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFEFEFEF' }, // Light gray color
        };
      });
    }
  });

  // Set column widths
  worksheet.getColumn(1).width = 12; // Empty column
  worksheet.getColumn(2).width = 20; // 학부
  worksheet.getColumn(3).width = 12; // 학번
  worksheet.getColumn(4).width = 12; // 이름
  worksheet.getColumn(5).width = 28; // 태깅시간

  // Save the workbook as a file
  workbook.xlsx.writeBuffer().then((buffer) => {
    const dataBlob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(dataBlob, filename);
  });
}

AttendListExportButton.propTypes = {
  data: PropTypes.array,
  event: PropTypes.object,
};

export default function AttendListExportButton({ data, event }) {
  return (
    <>
      <Button
        onClick={() => excel(data, event)}
        variant="contained"
        color="secondary"
        startIcon={<Iconify icon="eva:download-outline" />}
      >
        엑셀 다운로드
      </Button>
    </>
  );
}
