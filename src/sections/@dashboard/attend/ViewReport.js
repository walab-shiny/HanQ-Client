import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { LoadingButton } from '@mui/lab';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper } from '@mui/material';
import Iconify from '../../../components/iconify';
import Markdown from '../../../components/markdown/Markdown';
import { fDateString } from '../../../utils/formatTime';
import FormProvider, { RHFEditor } from '../../../components/hook-form';
import { editReport } from '../../../apis/report';
import { useSnackbar } from '../../../components/snackbar';

ViewReport.propTypes = {
  event: PropTypes.object,
  fetchData: PropTypes.func,
};

export default function ViewReport({ event, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const { report } = event;
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleEdit = () => setIsEdit((prev) => !prev);

  const ReportSchema = Yup.object().shape({
    content: Yup.string().required('소감문 내용을 입력해주세요.'),
  });

  const defaultValues = {
    content: report.content,
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(ReportSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await editReport(report.id, data.content);
      await fetchData();
      enqueueSnackbar('소감문이 수정되었습니다.', {
        variant: 'success',
      });
      toggleEdit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="success"
        startIcon={<Iconify icon="eva:expand-outline" />}
        onClick={handleOpen}
      >
        소감문 조회
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>소감문 조회</DialogTitle>
          <DialogContent>
            <DialogContentText variant="subtitle1" gutterBottom>
              {event.name}
            </DialogContentText>
            <DialogContentText sx={{ mb: 2 }}>작성일자: {fDateString(report.modifiedAt)}</DialogContentText>
            {isEdit ? (
              <RHFEditor simple name="content" maxSize={2048} />
            ) : (
              <Paper variant="outlined" sx={{ px: 2, minHeight: 240 }}>
                <Markdown children={report.content} />
              </Paper>
            )}
          </DialogContent>
          <DialogActions>
            {isEdit ? (
              <>
                <Button variant="contained" color="inherit" onClick={toggleEdit}>
                  취소
                </Button>
                <LoadingButton variant="contained" color="secondary" type="submit" loading={isSubmitting}>
                  제출
                </LoadingButton>
              </>
            ) : (
              <>
                <Button variant="contained" color="inherit" onClick={toggleEdit}>
                  편집
                </Button>
                <Button variant="contained" color="success" onClick={handleClose}>
                  닫기
                </Button>
              </>
            )}
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
