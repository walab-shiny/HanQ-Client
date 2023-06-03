import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Tabs, Tab, TextField, Autocomplete } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
// apis
import { getTagList } from '../../../apis/tag';
import { updateUser } from '../../../apis/user';

// ----------------------------------------------------------------------

UserEditForm.propTypes = {
  user: PropTypes.object,
  reloadUser: PropTypes.func,
};

export default function UserEditForm({ user, reloadUser }) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      department: user?.department || '',
      affiliation: user?.affiliation || '',
      studentNum: user?.studentNum || '',
      hostUntil: user?.hostUntil || '주최자 권한이 없습니다',
      picture: user?.picture || '',
      status: (user?.isHost && '주최자') || '사용자',
      tags: user?.tags || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const [tagStatus, setTagStatus] = useState('내 정보');

  const handleTagStatus = (event, newValue) => {
    setTagStatus(newValue);
  };

  const TABS = [{ value: '내 정보', label: '내 정보', color: 'info' }];

  useEffect(() => {
    if (user) {
      reset(defaultValues);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('picture', newFile);
      }
    },
    [setValue]
  );

  // ---- autocomplete
  const [tagList, setTagList] = useState([]);

  const onSubmit = async (data) => {
    try {
      await updateUser(data);
      await reloadUser(user.id);
      reset();
      enqueueSnackbar('사용자 정보가 변경되었습니다.', 'success');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    const tagList = await getTagList();
    setTagList(tagList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // autocomplete ----
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <Label
              color={values.status === '주최자' ? 'success' : 'warning'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {values.status}
            </Label>

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="picture"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            <RHFSwitch
              checked
              name="notification"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    알림 활성화
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    알림을 받으시려면 활성화 하세요.
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <Tabs
              value={tagStatus}
              onChange={handleTagStatus}
              sx={{
                px: 2,
                bgcolor: 'background.neutral',
              }}
            >
              {TABS.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </Tabs>

            <Box sx={{ p: 3 }}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="이름" disabled />
                <RHFTextField name="email" label="이메일" disabled />
                {user.affiliation === 'none' ? (
                  <RHFTextField name="department" label="학부" disabled />
                ) : (
                  <RHFTextField name="affiliation" label="소속" disabled />
                )}
                <RHFTextField name="studentNum" label="학번" disabled />
                {user.isHost ? (
                  user.hostUntil ? (
                    <>
                      <RHFTextField name="hostUntil" label="권한 마감 기한" disabled />
                    </>
                  ) : (
                    <>
                      <TextField value="주최 권한이 있습니다." disabled />
                    </>
                  )
                ) : (
                  <>
                    <RHFTextField name="hostUntil" disabled />
                  </>
                )}
                <Autocomplete
                  value={values.tags}
                  onChange={(event, newValue) => {
                    setValue('tags', newValue);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  multiple
                  options={tagList}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => <TextField {...params} label="관심 태그" />}
                />
              </Box>

              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  프로필 수정
                </LoadingButton>
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
