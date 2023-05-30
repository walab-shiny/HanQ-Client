import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
// @mui
import { Card, Container, CardContent, Typography, Breadcrumbs, Box, Link } from '@mui/material';
import { useSettingsContext } from '../components/settings';
// sections
import CarouselCenterMode from '../sections/@dashboard/event/list/CarouselCenterMode';
// apis
import { getEventListAll, getHotEventList, getTaggedEventList } from '../apis/event.ts';
import EmptyContent from '../components/empty-content/EmptyContent';
import { PATH_DASHBOARD } from '../routes/paths';
import { EventList } from '../sections/@dashboard/event/list';

// ----------------------------------------------------------------------

export default function EventListPage() {
  const { themeStretch } = useSettingsContext();

  const [loading, setLoading] = useState(true);
  const [taggedEventList, setTaggedEventList] = useState([]);
  const [hotEventList, setHotEventList] = useState([]);
  const [allEventList, setAllEventList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const taggedEventList = await getTaggedEventList();
      const hotEventList = await getHotEventList();
      const allEventList = await getEventListAll();
      setTaggedEventList(taggedEventList);
      setHotEventList(hotEventList);
      setAllEventList(allEventList);
      setLoading(false);
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
            <Link component={HashLink} smooth to="#all" color="inherit">
              ALL
            </Link>
          </Breadcrumbs>
        </Box>

        <Card sx={{ mb: 5 }} id="interest">
          <CardContent>
            <Typography variant="h4" mb={4}>
              TAGGED 🏷
            </Typography>
            {taggedEventList.length ? (
              <CarouselCenterMode data={taggedEventList} />
            ) : (
              <EmptyContent
                to={PATH_DASHBOARD.user}
                component={RouterLink}
                sx={{ textDecoration: 'none' }}
                title="프로필 설정에서 관심 태그를 등록하세요."
                description="클릭하면 프로필 설정 페이지로 이동합니다."
              />
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 7 }} id="hot">
          <CardContent>
            <Typography variant="h4" mb={4}>
              HOT 🔥
            </Typography>
            {hotEventList.length ? (
              <CarouselCenterMode data={hotEventList} />
            ) : (
              <EmptyContent title="인기 이벤트가 없습니다." />
            )}
          </CardContent>
        </Card>

        <Box id="all">
          <Typography variant="h4" mb={4}>
            ALL 📜
          </Typography>

          <EventList events={allEventList} loading={loading} />
        </Box>
      </Container>
    </>
  );
}

function Separator() {
  return <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.disabled' }} />;
}
