import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, InputAdornment } from '@mui/material';
// components
import { SkeletonProductItem } from '../../../../components/skeleton';
import EventCard from './EventCard';
import Iconify from '../../../../components/iconify';
import { CustomTextField } from '../../../../components/custom-input';
//

// ----------------------------------------------------------------------

EventList.propTypes = {
  loading: PropTypes.bool,
  events: PropTypes.array,
};

export default function EventList({ events, loading }) {
  const [search, setSearch] = useState('');
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  const filteredEvents = events.filter((event) => event.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <CustomTextField
        size="small"
        value={search}
        onChange={handleSearch}
        width={220}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        sx={{ mt: 5 }}
      >
        {(loading ? [...Array(12)] : filteredEvents).map((event, index) =>
          event ? <EventCard key={event.id} event={event} /> : <SkeletonProductItem key={index} />
        )}
        {filteredEvents.length === 0 && !loading && <Box>결과가 없습니다.</Box>}
      </Box>
    </>
  );
}
