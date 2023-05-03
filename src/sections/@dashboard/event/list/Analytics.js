//  @mui
import { Card, Divider, Stack, useTheme } from '@mui/material';
import Scrollbar from '../../../../components/scrollbar/Scrollbar';
import { InvoiceAnalytic } from '../../invoice/list';

export default function Analytics() {
  const theme = useTheme();
  return (
    <>
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
    </>
  );
}
