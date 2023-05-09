import { Helmet } from 'react-helmet-async';
import { HashLink } from 'react-router-hash-link';
import { useEffect, useState } from 'react';
// @mui
import { Card, Container, CardContent, Typography, Breadcrumbs, Box, Link } from '@mui/material';
import { useSettingsContext } from '../components/settings';
// sections
import CarouselCenterMode from '../sections/@dashboard/event/list/CarouselCenterMode';
// apis
import { getEventListAll } from '../apis/event.ts';
import EmptyContent from '../components/empty-content/EmptyContent';

// ----------------------------------------------------------------------

export default function EventList() {
  const { themeStretch } = useSettingsContext();

  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await getEventListAll();
      setEventData(eventList);
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>공개 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Box mb={3}>
          <Typography variant="h4" gutterBottom>
            공개 이벤트 목록 조회
          </Typography>
          <Breadcrumbs separator={<Separator />}>
            <Link component={HashLink} smooth to="#interest" color="inherit">
              TAGGED
            </Link>
            <Link component={HashLink} smooth to="#hot" color="inherit">
              HOT
            </Link>
          </Breadcrumbs>
        </Box>

        <Card sx={{ mb: 5 }} id="interest">
          <CardContent>
            <Typography variant="h4" mb={4}>
              TAGGED 🏷
            </Typography>
            {eventData.length ? (
              <CarouselCenterMode data={eventData} />
            ) : (
              <EmptyContent title={'오늘 열리는 이벤트가 없습니다'} />
            )}
          </CardContent>
        </Card>

        <Card id="hot">
          <CardContent>
            <Typography variant="h4" mb={4}>
              HOT 🔥
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

function Separator() {
  return <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />;
}
