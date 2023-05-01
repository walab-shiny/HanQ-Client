import * as Yup from 'yup';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Grid, Card, Stack, Button, TextField, Typography, InputAdornment, Autocomplete } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import { addEvent } from '../../../apis/event.ts';
import { getTagList } from '../../../apis/tag';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFEditor, RHFUpload, RHFTextField } from '../../../components/hook-form';
//
import NewEventPreview from './NewEventPreview';

// ----------------------------------------------------------------------

export default function NewEventForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [openPreview, setOpenPreview] = useState(false);

  const NewEventSchema = Yup.object().shape({
    name: Yup.string().required('이벤트명은 필수 항목입니다.'),
    location: Yup.string().required('장소는 필수 항목입니다.'),
    openAt: Yup.string().required('시작일시는 필수 항목입니다.').nullable(true),
    closeAt: Yup.string().required('종료일시는 필수 항목입니다.').nullable(true),
    image: Yup.mixed().nullable(true),
  });

  const defaultValues = {
    name: '',
    content: '',
    image: null,
    tags: [],
    public: true,
    openAt: moment(new Date()),
    closeAt: moment(new Date()),
    location: '',
    maxUsers: '',
    availableTime: '',
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: yupResolver(NewEventSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const [tags, setTags] = useState([]);
  useEffect(() => {
    const getTags = async () => {
      const data = await getTagList();
      setTags(data);
    };
    getTags();
  }, []);

  const values = watch();

  const handleOpenPreview = () => {
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const onSubmit = async (data) => {
    try {
      await addEvent(data);
      reset();
      handleClosePreview();
      enqueueSnackbar('이벤트가 등록되었습니다.', { variant: 'success' });
      navigate(PATH_DASHBOARD.host.list);
    } catch (error) {
      console.error(error);
    }
  };

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
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                <div>
                  <RHFSwitch
                    name="public"
                    label="공개 여부"
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </div>

                <Autocomplete
                  onChange={(event, newValue) => {
                    setValue('tags', newValue);
                  }}
                  multiple
                  options={tags}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} placeholder="관련 태그를 입력하세요." />}
                />

                <Controller
                  name="openAt"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DateTimePicker
                      format="YYYY/MM/DD hh:mm A"
                      label="시작일시"
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

                <Controller
                  name="closeAt"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DateTimePicker
                      format="YYYY/MM/DD hh:mm A"
                      label="종료일시"
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
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                미리보기
              </Button>

              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting}>
                등록하기
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>

        <NewEventPreview
          values={values}
          open={openPreview}
          isValid={isValid}
          isSubmitting={isSubmitting}
          onClose={handleClosePreview}
          onSubmit={handleSubmit(onSubmit)}
        />
      </FormProvider>
    </>
  );
}
