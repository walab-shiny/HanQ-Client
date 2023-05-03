import PropTypes from 'prop-types';
// @mui
import { TextField, Autocomplete } from '@mui/material';
// ----------------------------------------------------------------------

Dropdown.propTypes = {
  filterTag: PropTypes.arrayOf(PropTypes.object),
  onFilterTag: PropTypes.func,
  tagList: PropTypes.arrayOf(PropTypes.object),
};

export default function Dropdown({ filterTag, tagList, onFilterTag }) {
  return (
    <Autocomplete
      value={filterTag}
      onChange={(event, newValue) => {
        onFilterTag(newValue);
      }}
      multiple
      options={tagList}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => <TextField {...params} label="관심 태그" />}
      sx={{ width: 1, maxWidth: { sm: 360 } }}
    />
  );
}
