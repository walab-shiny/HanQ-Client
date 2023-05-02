import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { Tab, Tabs, Card, Table, Divider, TableBody, Container, TableContainer, Button } from '@mui/material';
// components
import Scrollbar from '../components/scrollbar';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
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
import { EventViewTableToolbar } from '../sections/@dashboard/event/list';
import { getEventList } from '../apis/event.ts';
import { getTagList } from '../apis/tag';
import { HostEventViewTableRow } from '../sections/@dashboard/host';
import Iconify from '../components/iconify';
import { PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: '순번', label: '순번', align: 'left' },
  { id: '주최기관', label: '주최기관', align: 'left' },
  { id: '제목', label: '제목', align: 'left' },
  { id: '시작일시', label: '시작일시', align: 'left' },
  { id: '장소', label: '장소', align: 'left' },
  { id: '상태', label: '상태', align: 'center' },
  { id: '상세보기' },
  { id: 'QR' },
  { id: '삭제' },
];

// ----------------------------------------------------------------------

export default function HostPage() {
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

  const [tagList, setTagList] = useState([]);

  const [filterName, setFilterName] = useState('');

  const [filterTag, setFilterTag] = useState([]);

  const [filterStatus, setFilterStatus] = useState('전체');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterTag,
    filterStatus,
  });

  const isFiltered = filterName !== '' || filterTag.length > 0 || filterStatus !== '전체';

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterTag) ||
    (!dataFiltered.length && !!filterStatus);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const TABS = [
    { value: '전체', label: '전체', color: 'info', count: tableData.length },
    { value: '진행 전', label: '진행 전', color: 'success', count: getLengthByStatus('진행 전') },
    { value: '진행 중', label: '진행 중', color: 'warning', count: getLengthByStatus('진행 중') },
    { value: '종료됨', label: '종료됨', color: 'error', count: getLengthByStatus('종료됨') },
  ];

  const handleFilterStatus = (event, newValue) => {
    setPage(0);
    setFilterStatus(newValue);
  };

  const handleFilterName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleFilterTag = (value) => {
    setPage(0);
    setFilterTag(value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterTag([]);
    setFilterStatus('전체');
  };

  const fetchData = async () => {
    const eventList = await getEventList();
    const tagList = await getTagList();
    setTableData(eventList.map((event) => ({ ...event, status: event.closed ? '종료됨' : '진행 중' })));
    setTagList(tagList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>주최 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="주최 이벤트 목록 조회"
          links={[]}
          action={
            <Button
              to={PATH_DASHBOARD.host.new}
              component={RouterLink}
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              새로운 이벤트
            </Button>
          }
        />

        <Card>
          <Tabs
            value={filterStatus}
            onChange={handleFilterStatus}
            sx={{
              px: 2,
              bgcolor: 'background.neutral',
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={
                  <Label color={tab.color} sx={{ mr: 1 }}>
                    {tab.count}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <Divider />

          <EventViewTableToolbar
            isFiltered={isFiltered}
            filterName={filterName}
            filterTag={filterTag}
            tagList={tagList}
            onFilterName={handleFilterName}
            onFilterTag={handleFilterTag}
            onResetFilter={handleResetFilter}
          />

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  onSort={onSort}
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                    <HostEventViewTableRow key={row.id} row={row} index={index} fetchData={fetchData} />
                  ))}

                  <TableEmptyRows emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus, filterTag }) {
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

  if (filterTag.length > 0) {
    inputData = inputData.filter((event) => {
      let flag = true;
      filterTag.forEach((tag) => {
        if (event.tags.filter((item) => item.name === tag.name).length === 0) {
          flag = false;
        }
      });
      return flag;
    });
  }

  return inputData;
}
