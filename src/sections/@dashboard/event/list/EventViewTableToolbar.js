import PropTypes from 'prop-types';
// @mui
import { Stack, InputAdornment, TextField, Button, Autocomplete } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

EventViewTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterTag: PropTypes.arrayOf(PropTypes.object),
  onFilterName: PropTypes.func,
  onFilterTag: PropTypes.func,
  onResetFilter: PropTypes.func,
  tagList: PropTypes.arrayOf(PropTypes.object),
};

export default function EventViewTableToolbar({
  isFiltered,
  filterName,
  filterTag,
  tagList,
  onFilterName,
  onFilterTag,
  onResetFilter,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <Autocomplete
        value={filterTag}
        onChange={(event, newValue) => {
          onFilterTag(newValue);
        }}
        multiple
        options={tagList}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => <TextField {...params} label="태그" />}
        sx={{ width: 1, maxWidth: { sm: 360 } }}
      />

      <TextField
        fullWidth
        value={filterName}
        onChange={onFilterName}
        placeholder="Search..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          지우기
        </Button>
      )}
    </Stack>
  );
}
