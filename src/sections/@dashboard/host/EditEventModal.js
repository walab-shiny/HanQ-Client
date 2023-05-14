import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { getTagList } from '../../../apis/tag';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import { editEvent } from '../../../apis/event.ts';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFEditor, RHFSwitch, RHFTextField, RHFUpload } from '../../../components/hook-form';

EditEventModal.propTypes = {
  event: PropTypes.object,
};

export default function EditEventModal({ event }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditEvent = async (data) => {
    try {
      await editEvent(event.id, data);
      enqueueSnackbar('수정되었습니다.', {
        variant: 'success',
      });
      handleClose();
      navigate(PATH_DASHBOARD.host.list);
    } catch (error) {
      console.error(error);
    }
  };
  const isClosed = event.status === '종료됨';

  const NewEventSchema = Yup.object().shape({
    name: Yup.string().required('이벤트명은 필수 항목입니다.'),
    location: Yup.string().required('장소는 필수 항목입니다.'),
    content: Yup.string().required('내용은 필수 항목입니다.'),
    image: Yup.mixed().nullable(true),
    openAt: Yup.string().required('시작일시는 필수 항목입니다.').nullable(true),
    closeAt: Yup.string().required('종료일시는 필수 항목입니다.').nullable(true),
  });

  const defaultValues = {
    name: event.name,
    location: event.location,
    content: event.content,
    image: event.image,
    isPublic: event.isPublic,
    tags: event.tags,
    openAt: moment(event.openAt, 'YYYY/MM/DD hh:mm A'),
    closeAt: moment(event.closeAt, 'YYYY/MM/DD hh:mm A'),
    availableTime: 0,
    maxUsers: event.maxUsers || 0,
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewEventSchema),
    defaultValues,
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const [tags, setTags] = useState([]);
  useEffect(() => {
    const getTags = async () => {
      const data = await getTagList();
      setTags(data);
    };
    getTags();
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile);
      }
    },
    [setValue]
  );

  const handleRemoveFile = () => {
    setValue('image', null);
  };

  return (
    <>
      <Tooltip title={isClosed ? '이벤트가 종료되었습니다.' : '이벤트 수정'}>
        <span>
          <IconButton onClick={handleOpen} disabled={isClosed}>
            <Iconify icon="eva:edit-outline" />
          </IconButton>
        </span>
      </Tooltip>
      <Dialog open={open} onClose={handleClose} sx={{ p: 3 }} maxWidth="lg" fullWidth>
        <DialogTitle>이벤트 수정하기</DialogTitle>
        <Divider />
        <DialogContent>
          <Box sx={{ p: 2, py: 5 }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(handleEditEvent)}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <RHFTextField name="name" label="이벤트명" />

                      <RHFTextField name="location" label="장소" />

                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          내용
                        </Typography>

                        <RHFEditor simple name="content" maxSize={2048} />
                      </Stack>

                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                          포스터 이미지
                        </Typography>

                        <RHFUpload name="image" maxSize={3145728} onDrop={handleDrop} onDelete={handleRemoveFile} />
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card sx={{ p: 3 }}>
                    <Stack spacing={3}>
                      <RHFSwitch
                        name="isPublic"
                        label="공개 여부"
                        labelPlacement="start"
                        sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                      />

                      <Autocomplete
                        defaultValue={event.tags}
                        onChange={(event, newValue) => {
                          setValue('tags', newValue);
                        }}
                        multiple
                        options={tags}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => <TextField {...params} label="태그" />}
                      />

                      <Controller
                        name="openAt"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DateTimePicker
                            format="YYYY/MM/DD hh:mm A"
                            label="QR 태깅 시작일시"
                            value={field.value}
                            onChange={(newValue) => {
                              if (newValue.isBefore(moment())) {
                                enqueueSnackbar('종료일시가 현재보다 빠릅니다.', { variant: 'error' });
                              } else {
                                field.onChange(newValue);
                              }
                            }}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                            )}
                          />
                        )}
                      />

                      <Controller
                        name="closeAt"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                          <DateTimePicker
                            format="YYYY/MM/DD hh:mm A"
                            label="QR 태깅 종료일시"
                            value={field.value}
                            onChange={(newValue) => {
                              field.onChange(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                            )}
                          />
                        )}
                      />

                      <RHFTextField
                        type="number"
                        name="maxUsers"
                        label="최대 인원수"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">명</InputAdornment>,
                        }}
                      />

                      <TextField value={event.affiliation} label="주관기관" disabled />
                    </Stack>
                  </Card>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                    <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleClose}>
                      취소
                    </Button>

                    <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                      수정하기
                    </LoadingButton>
                  </Stack>
                </Grid>
              </Grid>
            </FormProvider>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
