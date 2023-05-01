import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography, DialogActions, Dialog, Divider } from '@mui/material';
// components
import Image from '../../../components/image';
import Markdown from '../../../components/markdown';
import Scrollbar from '../../../components/scrollbar';
import EmptyContent from '../../../components/empty-content';

// ----------------------------------------------------------------------

BlogNewPostPreview.propTypes = {
  open: PropTypes.bool,
  isValid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export default function BlogNewPostPreview({ values, isValid, isSubmitting, open, onClose, onSubmit }) {
  const { name = '', content = '' } = values;

  const image = typeof values.image === 'string' ? values.image : values.image?.preview;

  const hasContent = name || content || image;

  const hasHero = name || image;

  return (
    <Dialog fullScreen open={open} onClose={onClose}>
      <DialogActions sx={{ py: 2, px: 3 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          미리보기
        </Typography>

        <Button variant="outlined" color="inherit" onClick={onClose}>
          취소
        </Button>

        <LoadingButton type="submit" variant="contained" disabled={!isValid} loading={isSubmitting} onClick={onSubmit}>
          등록하기
        </LoadingButton>
      </DialogActions>

      <Divider />

      {hasContent ? (
        <Scrollbar>
          {hasHero && <PreviewHero name={name} image={image} />}
          <Container sx={{ mt: 5, mb: 10 }}>
            <Markdown children={content} />
          </Container>
        </Scrollbar>
      ) : (
        <EmptyContent title="내용이 없습니다." />
      )}
    </Dialog>
  );
}

// ----------------------------------------------------------------------

PreviewHero.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
};

function PreviewHero({ name, image }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <Container
        sx={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9,
          position: 'absolute',
          color: 'common.white',
          pt: { xs: 3, lg: 10 },
        }}
      >
        <Typography variant="h2" component="h1">
          {name}
        </Typography>
      </Container>

      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8,
          position: 'absolute',
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
        }}
      />
      <Image alt="image" src={image} ratio="16/9" />
    </Box>
  );
}
