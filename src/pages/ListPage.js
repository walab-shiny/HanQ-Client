import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Card, CardContent, Container, Typography } from '@mui/material';
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
// apis
import { getEventList } from '../apis/event.ts';
// sections
import { CarouselCenterMode } from '../sections/@dashboard/event/list';

export default function ListPage() {
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
        <title>참여 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="참여 이벤트 목록 조회"
          links={[{ name: '소감문 제출 진행 중' }, { name: '소감문 제출 완료' }, { name: '소감문 미제출' }]}
        />

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Typography variant="h4" mb={4}>
              소감문 제출 진행 중 이벤트
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Typography variant="h4" mb={4}>
              소감문 제출 완료 이벤트
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>

        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Typography variant="h4" mb={4}>
              소감문 미제출 이벤트
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
