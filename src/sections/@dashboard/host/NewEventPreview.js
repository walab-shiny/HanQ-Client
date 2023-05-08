import PropTypes from 'prop-types';
import moment from 'moment';
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

NewEventPreview.propTypes = {
  affiliation: PropTypes.string,
  open: PropTypes.bool,
  isValid: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  isSubmitting: PropTypes.bool,
};

export default function NewEventPreview({ affiliation, values, isValid, isSubmitting, open, onClose, onSubmit }) {
  const {
    name = '',
    content = '',
    tags = [],
    location = '',
    openAt = null,
    closeAt = null,
    isPublic = false,
    availableTime = 0,
  } = values;
  const date = `${moment(new Date(openAt)).format('YYYY-MM-DD HH:mm:ss')} ~ ${moment(new Date(closeAt)).format(
    'YYYY-MM-DD HH:mm:ss'
  )}`;

  const image = typeof values.image === 'string' ? values.image : values.image?.preview;

  const hasContent = name || content || image;

  const hasHero = name || image;

  return (
    <Dialog fullScreen open={open} onClose={onClose} sx={{ p: 3 }}>
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
          {hasHero && (
            <PreviewHero
              name={name}
              image={image}
              location={location}
              date={date}
              affiliation={affiliation}
              isPublic={isPublic}
              availableTime={availableTime}
            />
          )}
          <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                {availableTime
                  ? `*이벤트 시작 전 15분 부터 QR 태깅이 가능하며 이벤트 시작 ${availableTime}분 후 QR 태깅 마감됩니다.*`
                  : '*이벤트 시작 전 15분 부터 QR 태깅이 가능합니다.*'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                일시: {date}
              </Typography>
              <Typography variant="h6">
                공개여부: {isPublic ? '공개' : '비공개'} / 장소: {location}
              </Typography>
            </Box>
            <Markdown children={content} />
            {tags.length > 0 && (
              <Typography sx={{ mt: 5 }}>
                {tags.map((tag) => (
                  <span key={tag.id}>#{tag.name} </span>
                ))}
              </Typography>
            )}
            {image && <Image alt="image" src={image} sx={{ mt: 7, maxWidth: 'sm', mx: 'auto' }} />}
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
  affiliation: PropTypes.string,
};

function PreviewHero({ name, image, affiliation }) {
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
          pt: { xs: 3, lg: 15 },
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          {name}
        </Typography>
        <Typography variant="h4">주관기관: {affiliation}</Typography>
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
      <Image alt="image" src={image} sx={{ height: { xs: 300, lg: 400 } }} />
    </Box>
  );
}
