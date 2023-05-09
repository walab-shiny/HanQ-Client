import PropTypes from 'prop-types';
// @mui
import { Box, Paper, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../utils/formatNumber';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

Analytics.propTypes = {
  list: PropTypes.array,
};

export default function Analytics({ list }) {
  return (
    <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)">
      {list.map((site) => (
        <Paper key={site.label} variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
          {(site.value === 'total user' && <Iconify icon="eva:people-fill" color="info.main" width={32} />) ||
            (site.value === 'today user' && <Iconify icon="eva:person-fill" color="warning.main" width={32} />) ||
            (site.value === 'total event' && <Iconify icon="eva:calendar-fill" color="error.main" width={32} />) ||
            (site.value === 'total scan' && (
              <Iconify icon="eva:checkmark-circle-2-fill" color="success.main" width={32} />
            )) || <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />}

          <Typography variant="h6" sx={{ mt: 0.5 }}>
            {fShortenNumber(site.total)}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {site.label}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
