import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  Typography,
  DialogActions,
  Dialog,
  Divider,
  Tooltip,
  IconButton,
  Link,
} from '@mui/material';
// components
import Image from '../../../../components/image';
import Markdown from '../../../../components/markdown';
import Scrollbar from '../../../../components/scrollbar';
import EmptyContent from '../../../../components/empty-content';
import Iconify from '../../../../components/iconify/Iconify';
import { fDateString } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

NewEventView.propTypes = {
  values: PropTypes.object,
  isLink: PropTypes.bool,
};

export default function NewEventView({ values, isLink = false }) {
  const [open, setOpen] = useState(false);
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
  } = values;
  const date = `${fDateString(openAt)} ~ ${fDateString(closeAt)}`;

  const image = typeof values.image === 'string' ? values.image : values.image?.preview;

  const hasContent = name || content || image;

  const hasHero = name || image;

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isLink ? (
        <Link
          color="inherit"
          variant="overline"
          sx={{
            opacity: 0.72,
            alignItems: 'center',
            display: 'inline-flex',
            transition: (theme) => theme.transitions.create('opacity'),
            '&:hover': { opacity: 1 },
          }}
          onClick={handleOpen}
        >
          자세히 보기
          <Iconify icon="eva:arrow-forward-fill" width={16} sx={{ ml: 1 }} />
        </Link>
      ) : (
        <Tooltip title="이벤트 상세보기">
          <span>
            <IconButton onClick={handleOpen}>
              <Iconify icon="eva:expand-outline" />
            </IconButton>
          </span>
        </Tooltip>
      )}

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
                    ? `*이벤트 시작 전 15분 부터 QR 태깅이 가능하며 이벤트 시작 ${availableTime}분 후 QR 태깅이 마감됩니다.*`
                    : '*이벤트 시작 전 15분 부터 QR 태깅이 가능합니다.*'}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  일시: {date}
                </Typography>
                <Typography variant="h6">
                  공개여부: {isPublic ? '공개' : '비공개'} / 장소: {location}
                </Typography>
              </Box>
              <Divider sx={{ mb: 5 }} />
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
