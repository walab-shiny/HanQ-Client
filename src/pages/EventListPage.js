import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import sumBy from 'lodash/sumBy';
// @mui
import {
  Tab,
  Tabs,
  Card,
  Table,
  Divider,
  TableBody,
  Container,
  TableContainer,
  useTheme,
  Stack,
  CardHeader,
  CardContent,
  Typography,
} from '@mui/material';
// _mock
import _mock from '../_mock/_mock';
// components
import Scrollbar from '../components/scrollbar';

import Label from '../components/label';
import { useSettingsContext } from '../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from '../components/table';
// sections
import { EventViewTableRow, EventViewTableToolbar } from '../sections/@dashboard/event/list';
import { InvoiceAnalytic } from '../sections/@dashboard/invoice/list';
import { getEventList } from '../apis/event.ts';
import { getTagList } from '../apis/tag';
import CarouselCenterMode from '../sections/@dashboard/event/list/CarouselCenterMode';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '순번', label: '순번', align: 'left' },
  { id: '주최기관', label: '주최기관', align: 'left' },
  { id: '제목', label: '제목', align: 'left' },
  { id: '시작일시', label: '시작일시', align: 'left' },
  { id: '종료일시', label: '종료일시', align: 'left' },
  { id: '장소', label: '장소', align: 'left' },
  { id: '참여인원수', label: '참여인원수', align: 'left' },
  { id: '상태', label: '상태', align: 'left' },
  { id: '' },
];

const getTagNameList = (tagList) => tagList.map((tag) => tag.name);

// ----------------------------------------------------------------------

const _carouselData = [...Array(5)].map((_, index) => ({
  id: _mock.id(index),
  title: _mock.text.title(index),
  image: _mock.image.cover(index),
  description: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export default function EventList() {
  const theme = useTheme();

  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [tagNameList, setTagNameList] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterRole, setFilterRole] = useState('전체');

  const [filterStatus, setFilterStatus] = useState('전체');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const isFiltered = filterName !== '' || filterRole !== '전체' || filterStatus !== '전체';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const getLengthByStatus = (status) => tableData.filter((item) => item.close === status).length;

  const TABS = [
    { value: '전체', label: '전체', color: 'info', count: tableData.length },
    { value: '진행 전', label: '진행 전', color: 'success', count: getLengthByStatus('paid') },
    { value: '진행 중', label: '진행 중', color: 'warning', count: getLengthByStatus('unpaid') },
    { value: '종료됨', label: '종료됨', color: 'error', count: getLengthByStatus('overdue') },
    { value: 'draft', label: 'Draft', color: 'default', count: getLengthByStatus('draft') },
  ];

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterRole('전체');
    setFilterStatus('전체');
  };

  useEffect(() => {
    const fetchData = async () => {
      const eventList = await getEventList();
      const tagList = await getTagList();
      const tagNameList = getTagNameList(tagList);
      setTableData(eventList);
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
                price={sumBy(tableData, 'totalPrice')}
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
            <CarouselCenterMode data={_carouselData} />
          </CardContent>
        </Card>
      </Container>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Card>
          <CardContent>
            <Typography variant="h4" mb={4}>
              HOT 🔥
            </Typography>
            <CarouselCenterMode data={_carouselData} />
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterRole }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((event) => event.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  if (filterStatus !== '전체') {
    inputData = inputData.filter((event) => event.status === filterStatus);
  }

  if (filterRole !== '전체') {
    inputData = inputData.filter((event) => {
      const tagNameList = getTagNameList(event.tags);
      return tagNameList.includes(filterRole);
    });
  }

  return inputData;
}
