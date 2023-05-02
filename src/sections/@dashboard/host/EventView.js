import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Button, Container, Typography, DialogActions, Dialog, Divider } from '@mui/material';
// components
import Image from '../../../components/image';
import Markdown from '../../../components/markdown';
import Scrollbar from '../../../components/scrollbar';
import EmptyContent from '../../../components/empty-content';
import Iconify from '../../../components/iconify/Iconify';
import { fDateString } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

NewEventView.propTypes = {
  values: PropTypes.object,
};

export default function NewEventView({ values }) {
  const [open, setOpen] = useState(false);
  const { name = '', content = '', tags = [], location = '', openAt = null } = values;
  const date = fDateString(openAt);

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
      <Button
        variant="contained"
        color="info"
        size="small"
        startIcon={<Iconify icon="ic:round-content-paste-search" />}
        onClick={handleOpen}
      >
        상세보기
      </Button>

      <Dialog fullScreen open={open} onClose={handleClose}>
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
            {hasHero && <PreviewHero name={name} image={image} location={location} date={date} />}
            <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
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
  location: PropTypes.string,
  date: PropTypes.string,
};

function PreviewHero({ name, image, location, date }) {
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
        <Typography variant="h5">
          {date && `일시: ${date}`}
          {date && location && ` / `}
          {location && `장소: ${location}`}
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
      <Image alt="image" src={image} sx={{ height: { xs: 300, lg: 400 } }} />
    </Box>
  );
}
