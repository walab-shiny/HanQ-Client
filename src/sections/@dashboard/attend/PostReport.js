import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Iconify from '../../../components/iconify';
import FormProvider, { RHFEditor } from '../../../components/hook-form';
import { postReport } from '../../../apis/report';
import { useSnackbar } from '../../../components/snackbar';

PostReport.propTypes = {
  event: PropTypes.object,
  fetchData: PropTypes.func,
};

export default function PostReport({ event, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const NewReportSchema = Yup.object().shape({
    content: Yup.string().required('소감문 내용을 입력해주세요.'),
  });

  const defaultValues = {
    content: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewReportSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await postReport(event.id, data.content);
      fetchData();
      enqueueSnackbar('소감문이 제출되었습니다.', {
        variant: 'success',
      });
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        startIcon={<Iconify icon="eva:edit-2-outline" />}
        onClick={handleOpen}
      >
        소감문 작성
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>소감문 작성</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>{event.name}에 대한 소감문을 작성하세요.</DialogContentText>
            <RHFEditor simple name="content" maxSize={2048} />
          </DialogContent>
          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              취소
            </Button>
            <LoadingButton variant="contained" color="secondary" type="submit" loading={isSubmitting}>
              제출
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
