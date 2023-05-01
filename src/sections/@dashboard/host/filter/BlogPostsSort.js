import PropTypes from 'prop-types';
// @mui
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

BlogPostsSort.propTypes = {
  onSort: PropTypes.func,
  sortBy: PropTypes.string,
  sortOptions: PropTypes.array,
};

export default function BlogPostsSort({ sortBy, sortOptions, onSort }) {
  return (
    <TextField
      select
      size="small"
      value={sortBy}
      onChange={onSort}
      SelectProps={{
        sx: { typography: 'body2' },
      }}
    >
      {sortOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            mx: 1,
            my: 0.5,
            borderRadius: 0.75,
            typography: 'body2',
            textTransform: 'capitalize',
            '&:first-of-type': { mt: 0 },
            '&:last-of-type': { mb: 0 },
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
