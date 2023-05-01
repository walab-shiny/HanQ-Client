import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import sumBy from 'lodash/sumBy';
// @mui
import { Card, Divider, Container, useTheme, Stack, CardContent, Typography } from '@mui/material';
// _mock
import _mock from '../_mock/_mock';
// components
import Scrollbar from '../components/scrollbar';

import { useSettingsContext } from '../components/settings';
import { useTable } from '../components/table';
// sections
import { EventViewTableRow, EventViewTableToolbar } from '../sections/@dashboard/event/list';
import { InvoiceAnalytic } from '../sections/@dashboard/invoice/list';
import { getEventList } from '../apis/event.ts';
import { getTagList } from '../apis/tag';
import CarouselCenterMode from '../sections/@dashboard/event/list/CarouselCenterMode';

// ----------------------------------------------------------------------

const getTagNameList = (tagList) => tagList.map((tag) => tag.name);

export default function EventList() {
  const theme = useTheme();

  const { page, order, orderBy, rowsPerPage, setPage, onSort, onChangePage, onChangeRowsPerPage } = useTable();

  const { themeStretch } = useSettingsContext();

  const [eventData, setEventData] = useState([]);

  const [tagNameList, setTagNameList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await getEventList();
      const tagList = await getTagList();
      const tagNameList = getTagNameList(tagList);
      setEventData(eventList);
      setTagNameList(tagNameList);
    };
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>공개 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ mb: 5 }}>
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="전체 이벤트 수"
                total={100}
                percent={100}
                // price={sumBy(tableData, 'totalPrice')}
                icon="ic:round-receipt"
                color={theme.palette.info.main}
              />

              <InvoiceAnalytic
                title="이벤트 참석자 수"
                percent={100}
                total={100}
                icon="eva:clock-fill"
                color={theme.palette.warning.main}
              />

              <InvoiceAnalytic
                title="어제 접속자 수"
                percent={100}
                total={100}
                icon="eva:bell-fill"
                color={theme.palette.error.main}
              />

              <InvoiceAnalytic
                title="오늘 접속자 수"
                percent={100}
                total={100}
                icon="eva:file-fill"
                color={theme.palette.success.main}
              />
            </Stack>
          </Scrollbar>
        </Card>
      </Container>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card sx={{ mb: 5 }}>
          <CardContent>
            <Typography variant="h4" mb={4}>
              TODAY
            </Typography>
            <CarouselCenterMode data={eventData} />
          </CardContent>
        </Card>
      </Container>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
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
