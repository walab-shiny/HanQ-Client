import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Dialog, DialogActions, Divider, Typography } from '@mui/material';
// components
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import Markdown from '../../../../components/markdown/Markdown';
import Image from '../../../../components/image/Image';
import EmptyContent from '../../../../components/empty-content/EmptyContent';
// utils
import { fDateString } from '../../../../utils/formatTime';

EventInfoDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  item: PropTypes.object,
};

export default function EventInfoDialog({ open, handleClose, item }) {
  const {
    name = '',
    affiliation = '',
    content = '',
    tags = [],
    location = '',
    openAt = null,
    closeAt = null,
    isPublic = false,
    availableTime = 0,
  } = item;
  const date = `${fDateString(openAt)} ~ ${fDateString(closeAt)}`;

  const image = typeof item.image === 'string' ? item.image : item.image?.preview;

  const hasContent = name || content || image;

  const hasHero = name || image;
  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose} sx={{ p: 3 }}>
        <DialogActions sx={{ py: 2, px: 3 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>

          <Button variant="outlined" color="inherit" onClick={handleClose}>
            닫기
          </Button>
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
    </>
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
