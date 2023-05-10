import PropTypes from 'prop-types';
// @mui
import { Box, Card, Stack, Typography } from '@mui/material';
// components
import Label from '../../../components/label';
import Image from '../../../components/image';
import { EventView } from '../event/view';
import { PostReport } from '.';
import { fDateString } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

EventCard.propTypes = {
  event: PropTypes.object,
};

export default function EventCard({ event }) {
  const { name, image, status } = event;
  console.log(event);
  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      <Box sx={{ position: 'relative', p: 1 }}>
        {status && (
          <Label
            variant="filled"
            color={(status === '진행 전' && 'success') || (status === '진행 중' && 'warning') || 'error'}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: 'absolute',
              textTransform: 'uppercase',
            }}
          >
            {status}
          </Label>
        )}

        <Image alt={name} src={image} ratio="1/1" sx={{ borderRadius: 1.5 }} />
      </Box>

      <Stack spacing={2.5} sx={{ p: 3 }}>
        <Typography variant="subtitle2">{name}</Typography>

        <Typography variant="body2">출석일: {fDateString(event.taggedTime)}</Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <EventView values={event} isLink />
          <PostReport event={event} />
        </Stack>
      </Stack>
    </Card>
  );
}
