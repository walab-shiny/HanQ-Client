import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Paper, CardContent } from '@mui/material';
// utils
import { bgGradient } from '../../../../utils/cssStyles';
// components
import Image from '../../../../components/image';
import TextMaxLine from '../../../../components/text-max-line';
import Carousel, { CarouselArrows } from '../../../../components/carousel';
import { EventView } from '../view';

// ----------------------------------------------------------------------

CarouselCenterMode.propTypes = {
  data: PropTypes.array,
};

export default function CarouselCenterMode({ data }) {
  const carouselRef = useRef(null);

  const theme = useTheme();

  const carouselSettings = {
    slidesToShow: 3,
    centerMode: true,
    centerPadding: '60px',
    rtl: Boolean(theme.direction === 'rtl'),
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, centerPadding: '0' },
      },
    ],
  };

  const handlePrev = () => {
    carouselRef.current?.slickPrev();
  };

  const handleNext = () => {
    carouselRef.current?.slickNext();
  };

  return (
    <>
      {data.length < 3 ? (
        <Box>
          <Carousel ref={carouselRef} {...carouselSettings} slidesToShow={data.length}>
            {data.map((item) => (
              <Box key={item.id} sx={{ px: 1, maxWidth: 300 }}>
                <CarouselItem item={item} />
              </Box>
            ))}
          </Carousel>
        </Box>
      ) : (
        <Box
          sx={{
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <CarouselArrows filled onNext={handleNext} onPrevious={handlePrev}>
            <Carousel ref={carouselRef} {...carouselSettings}>
              {data.map((item) => (
                <Box key={item.id} sx={{ px: 1 }}>
                  <CarouselItem item={item} />
                </Box>
              ))}
            </Carousel>
          </CarouselArrows>
        </Box>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

CarouselItem.propTypes = {
  item: PropTypes.object,
};

function CarouselItem({ item }) {
  const theme = useTheme();

  const { image, name } = item;

  return (
    <>
      <Paper
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {image ? (
          <>
            <Image alt={name} src={image} ratio="3/4" />
          </>
        ) : (
          <>
            <Image src="/logo/logo.png" ratio="3/4" sx={{ borderRadius: 1.5 }} />
          </>
        )}

        <CardContent
          sx={{
            bottom: 0,
            zIndex: 9,
            width: '100%',
            textAlign: 'left',
            position: 'absolute',
            color: 'common.white',
            ...bgGradient({
              direction: 'to top',
              startColor: `${theme.palette.grey[900]} 25%`,
              endColor: `${alpha(theme.palette.grey[900], 0)} 100%`,
            }),
          }}
        >
          <TextMaxLine variant="h4" paragraph>
            {name}
          </TextMaxLine>

          <EventView values={item} isLink />
        </CardContent>
      </Paper>
    </>
  );
}
