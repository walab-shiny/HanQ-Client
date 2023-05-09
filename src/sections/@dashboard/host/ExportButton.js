import * as xlsx from 'xlsx';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import Iconify from '../../../components/iconify';

function excel(data, filename) {
  const jsonData = data;
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.json_to_sheet(jsonData);
  xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
  xlsx.writeFile(workbook, filename);
}

ExportButton.propTypes = {
  data: PropTypes.array,
  eventName: PropTypes.string,
};

export default function ExportButton({ data, eventName }) {
  const filename = `${eventName} 참여자 명단.xlsx`;
  return (
    <>
      <Button
        onClick={() => excel(data, filename)}
        variant="contained"
        color="secondary"
        startIcon={<Iconify icon="eva:download-outline" />}
      >
        엑셀 다운로드
      </Button>
    </>
  );
}
