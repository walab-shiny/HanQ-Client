import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell, Typography, Chip, ListItem } from '@mui/material';
// components
import Label from '../../../components/label';
import { fDateString } from '../../../utils/formatTime';
import { CloseEventModal, EventView, QRScan } from '.';
import ParticipantViewModal from './ParticipantViewModal';
import ShareModal from './ShareModal';

// ----------------------------------------------------------------------

HostEventViewTableRow.propTypes = {
  row: PropTypes.object,
  index: PropTypes.number,
  fetchData: PropTypes.func,
};

export default function HostEventViewTableRow({ row, index, fetchData }) {
  const { tags, name, openAt, closeAt, status } = row;

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

        <TableCell>
          {tags.map((tag) => (
            <ListItem key={tag.id} dense>
              <Chip label={tag.name} size="small" />
            </ListItem>
          ))}
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell>
          {fDateString(openAt)} ~
          <br />
          {fDateString(closeAt)}
        </TableCell>

        <TableCell align="center">
          <Label variant="soft" color={labelColor} sx={{ textTransform: 'capitalize' }}>
            {status}
          </Label>
        </TableCell>

        <TableCell>
          <EventView values={row} />
        </TableCell>

        <TableCell>
          <ParticipantViewModal event={row} />
        </TableCell>

        <TableCell>
          <ShareModal event={row} />
        </TableCell>

        <TableCell>
          <CloseEventModal event={row} fetchData={fetchData} />
        </TableCell>

        <TableCell>
          <QRScan event={row} disabled={!active} />
        </TableCell>
      </TableRow>
    </>
  );
}
