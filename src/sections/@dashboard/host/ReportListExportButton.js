import * as xlsx from 'xlsx';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Iconify from '../../../components/iconify';
import { fDateString } from '../../../utils/formatTime';

function excel(data, eventName) {
  const filename = `${eventName} 소감문 목록.xlsx`;
  const jsonData = data.map((item) => ({
    studentNum: item.studentNum,
    name: item.name,
    modifiedAt: fDateString(item.modifiedAt),
    content: item.content.replace(/<[^>]+>/g, ''),
  }));
  const Heading = [['학번', '이름', '제출 시간', '내용']];

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([]);
  xlsx.utils.sheet_add_aoa(ws, Heading);
  xlsx.utils.sheet_add_json(ws, jsonData, { origin: 'A2', skipHeader: true });
  xlsx.utils.book_append_sheet(wb, ws, '소감문 목록');
  xlsx.writeFile(wb, filename);
}

ReportListExportButton.propTypes = {
  data: PropTypes.array,
  eventName: PropTypes.string,
};

export default function ReportListExportButton({ data, eventName }) {
  return (
    <>
      <Button
        onClick={() => excel(data, eventName)}
        variant="contained"
        color="secondary"
        startIcon={<Iconify icon="eva:download-outline" />}
      >
        엑셀 다운로드
      </Button>
    </>
  );
}
