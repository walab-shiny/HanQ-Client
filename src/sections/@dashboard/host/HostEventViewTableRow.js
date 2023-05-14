import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography, Chip, ListItem, Stack } from '@mui/material';
// components
import Label from '../../../components/label';
import { fDateString } from '../../../utils/formatTime';
import { CloseEventModal, EditEventModal, ParticipantViewModal, QRScan, ShareModal } from '.';
import { EventView } from '../event/view';

// ----------------------------------------------------------------------

HostEventViewTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  fetchData: PropTypes.func,
};

export default function HostEventViewTableRow({ row, index, fetchData }) {
  const { tags, name, openAt, status } = row;

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
        <TableCell align="center">
          <Typography variant="subtitle2" noWrap>
            {index + 1}
          </Typography>
        </TableCell>

        <TableCell>
          {tags.map((tag) => (
            <ListItem key={tag.id} dense>
              <Chip label={tag.name} size="small" />
            </ListItem>
          ))}
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>{fDateString(openAt)}</TableCell>

        <TableCell align="center">
          <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
            {status}
          </Label>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <EventView values={row} />
            <ParticipantViewModal event={row} />
            <EditEventModal event={row} />
            <CloseEventModal event={row} fetchData={fetchData} />
          </Stack>
        </TableCell>

        <TableCell>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <QRScan event={row} disabled={!active} />
            <ShareModal event={row} />
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
}
