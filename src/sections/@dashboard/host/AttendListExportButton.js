import * as xlsx from 'xlsx';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Iconify from '../../../components/iconify';
import { fDateString } from '../../../utils/formatTime';

function excel(data, eventName) {
  const filename = `${eventName} 참여자 명단.xlsx`;
  const jsonData = data.map((item) => ({
    studentNum: item.studentNum,
    name: item.name,
    taggedAt: fDateString(item.taggedAt),
  }));
  const Heading = [['학번', '이름', '태깅 시간']];

  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet([]);
  xlsx.utils.sheet_add_aoa(ws, Heading);
  xlsx.utils.sheet_add_json(ws, jsonData, { origin: 'A2', skipHeader: true });
  xlsx.utils.book_append_sheet(wb, ws, '참여자 명단');
  xlsx.writeFile(wb, filename);
}

AttendListExportButton.propTypes = {
  data: PropTypes.array,
  eventName: PropTypes.string,
};

export default function AttendListExportButton({ data, eventName }) {
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
