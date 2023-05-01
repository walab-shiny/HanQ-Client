import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { TableRow, TableCell, Typography, Button } from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import { fDateString } from '../../../../utils/formatTime';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

EventViewTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
};

export default function EventViewTableRow({ row, index }) {
  const { hostId, name, openAt, closeAt, location, maxUsers, closed } = row;

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

        <TableCell>{fDateString(closeAt)}</TableCell>

        <TableCell>{location}</TableCell>

        <TableCell>{maxUsers}</TableCell>

        <TableCell align="left">
          <Label variant="soft" color={closed ? 'error' : 'success'} sx={{ textTransform: 'capitalize' }}>
            {closed ? '종료됨' : '진행 중'}
          </Label>
        </TableCell>

        <TableCell>
          <Button
            to={PATH_DASHBOARD.all}
            component={RouterLink}
            variant="contained"
            color="info"
            size="small"
            startIcon={<Iconify icon="ic:round-content-paste-search" />}
          >
            상세보기
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}
