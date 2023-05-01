import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { Tab, Tabs, Card, Table, Divider, TableBody, Container, TableContainer } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
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
import { EventViewTableRow, EventViewTableToolbar } from '../sections/event/list';
import { getEventList } from '../apis/event.ts';
import { getTagList } from '../apis/tag';

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

export default function EventList() {
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
        <title>모든 이벤트 목록 조회 | HanQ</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs heading="모든 이벤트 목록 조회" links={[]} />

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
            filterRole={filterRole}
            optionsRole={['전체', ...tagNameList]}
            onFilterName={handleFilterName}
            onFilterRole={handleFilterRole}
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
                    <EventViewTableRow key={row.id} row={row} index={index} />
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
