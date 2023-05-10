import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Tabs, Tab, Button, TextField } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import Steps from './Steps';
import Dropdown from './Dropdown';
// apis
import { getTagList } from '../../../apis/tag';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role Number is required'),
    avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      department: currentUser?.department || '',
      affiliation: currentUser?.affiliation || '',
      address: currentUser?.address || '',
      studentNum: currentUser?.studentNum || '',
      state: currentUser?.state || '',
      hostUntil: currentUser?.hostUntil || '주최자 권한이 없습니다',
      zipCode: currentUser?.zipCode || '',
      avatarUrl: currentUser?.picture,
      isVerified: currentUser?.isVerified || true,
      status: (currentUser?.isHost && '주최자') || '사용자',
      company: currentUser?.company || '',
      role: currentUser?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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

  const TABS = [
    { value: '내 정보', label: '내 정보', color: 'info' },
    { value: '권한 기록', label: '권한 기록', color: 'error' },
  ];

  const STEPS = ['권한 없음', '권한 신청 완료', '권한 승인 대기 중', '권한 승인 완료'];

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(!isEdit ? 'Create success!' : 'Update success!');
      navigate(PATH_DASHBOARD.user.list);
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
        setValue('avatarUrl', newFile);
      }
    },
    [setValue]
  );

  // ---- autocomplete
  const [tagList, setTagList] = useState([]);

  const [filterTag, setFilterTag] = useState([]);

  const handleFilterTag = (value) => {
    setFilterTag(value);
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
            {isEdit && (
              <Label
                color={values.status === '사용자' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
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
            {tagStatus === '내 정보' ? (
              <>
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
                    {currentUser.affiliation === 'none' ? (
                      <RHFTextField name="department" label="학부" disabled />
                    ) : (
                      <RHFTextField name="affiliation" label="소속" disabled />
                    )}

                    <RHFTextField name="studentNum" label="학번" disabled />
                    {currentUser.isHost ? (
                      currentUser.hostUntil ? (
                        <>
                          <RHFTextField name="hostUntil" label="권한 마감 기한" disabled />
                        </>
                      ) : (
                        <>
                          <TextField value="주최 권한이 있습니다" disabled />
                        </>
                      )
                    ) : (
                      <>
                        <RHFTextField name="hostUntil" disabled />
                      </>
                    )}
                    <Dropdown filterTag={filterTag} tagList={tagList} onFilterTag={handleFilterTag} />
                  </Box>

                  <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                      {!isEdit ? 'Create User' : '프로필 수정'}
                    </LoadingButton>
                  </Stack>
                </Box>
              </>
            ) : (
              <>
                <Box p={3}>
                  {}
                  {currentUser.isPending ? (
                    <>
                      <Steps steps={STEPS} activeStep={currentUser?.isHost ? 4 : currentUser?.isPending ? 2 : 1} />
                    </>
                  ) : currentUser.isHost ? (
                    <Steps steps={STEPS} activeStep={4} />
                  ) : (
                    <>
                      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                        <Link to={'/hanq/host/request'}>
                          <Button variant="contained">권한 신청</Button>
                        </Link>
                      </Stack>
                    </>
                  )}
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
