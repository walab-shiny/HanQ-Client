import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Container } from '@mui/material';
// components
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
// apis
import { getAttendEventList } from '../apis/event.ts';
import { AttendEventList } from '../sections/@dashboard/attend';
// sections

export default function ListPage() {
  const { themeStretch } = useSettingsContext();
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await getAttendEventList();
      setEventData(eventList);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>참여 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="참여 이벤트 목록 조회" links={[]} />

        <AttendEventList events={eventData} loading={loading} />
      </Container>
    </>
  );
}
