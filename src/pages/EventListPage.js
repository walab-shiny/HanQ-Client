import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, Container, CardContent, Typography } from '@mui/material';
import { useSettingsContext } from '../components/settings';
// sections
import { Analytics } from '../sections/@dashboard/event/list';
import CarouselCenterMode from '../sections/@dashboard/event/list/CarouselCenterMode';
import CustomBreadcrumbs from '../components/custom-breadcrumbs/CustomBreadcrumbs';
// apis
import { getEventList } from '../apis/event.ts';

// ----------------------------------------------------------------------

export default function EventList() {
  const { themeStretch } = useSettingsContext();

  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await getEventList();
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
        <CustomBreadcrumbs heading="공개 이벤트 목록 조회" links={[{ name: 'TODAY' }, { name: 'HOT' }]} />
        <Analytics />

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Typography variant="h4" mb={4} className="today">
              TODAY
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h4" mb={4} className="hot">
              HOT 🔥
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
