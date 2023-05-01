import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography } from '@mui/material';
// components
import Label from '../../../components/label';
import { fDateString } from '../../../utils/formatTime';
import { EventView, QRScan } from '.';

// ----------------------------------------------------------------------

HostEventViewTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};

export default function HostEventViewTableRow({ row, index }) {
  const { hostId, name, openAt, location, maxUsers, closed } = row;

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

        <TableCell>{maxUsers}</TableCell>

        <TableCell align="left">
          <Label variant="soft" color={closed ? 'error' : 'success'} sx={{ textTransform: 'capitalize' }}>
            {closed ? '종료됨' : '진행 중'}
          </Label>
        </TableCell>

        <TableCell>
          <EventView values={row} />
        </TableCell>

        <TableCell>
          <QRScan event={row} />
        </TableCell>
      </TableRow>
    </>
  );
}
