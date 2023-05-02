import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography } from '@mui/material';
// components
import Label from '../../../components/label';
import { fDateString } from '../../../utils/formatTime';
import { CloseEventModal, EventView, QRScan } from '.';

// ----------------------------------------------------------------------

HostEventViewTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  fetchData: PropTypes.func,
};

export default function HostEventViewTableRow({ row, index, fetchData }) {
  const { hostId, name, openAt, location, status } = row;

  const getLabelColor = (statue) => {
    switch (statue) {
      case '진행 전':
        return 'success';
      case '진행 중':
        return 'warning';
      case '종료됨':
        return 'error';
      default:
        return 'success';
    }
  };

  const labelColor = getLabelColor(status);
  const active = row.status === '진행 중';

  return (
    <>
      <TableRow>
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {index + 1}
          </Typography>
        </TableCell>

        <TableCell>{hostId}</TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{fDateString(openAt)}</TableCell>

        <TableCell>{location}</TableCell>

        <TableCell align="center">
          <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
            {status}
          </Label>
        </TableCell>

        <TableCell>
          <EventView values={row} />
        </TableCell>

        <TableCell>
          <QRScan event={row} disabled={!active} />
        </TableCell>

        <TableCell>
          <CloseEventModal event={row} fetchData={fetchData} />
        </TableCell>
      </TableRow>
    </>
  );
}
