import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, styled, alpha, Alert, Button, IconButton } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from '../../../components/hook-form';
import Image from '../../../components/image';
import Iconify from '../../../components/iconify';
import { requestHost } from '../../../apis/request';
import { fDateString } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const ImageContainer = styled('div')(({ theme }) => ({
  width: 144,
  height: 144,
  margin: 'auto',
  display: 'flex',
  overflow: 'hidden',
  borderRadius: '50%',
  alignItems: 'center',
  position: 'relative',
  justifyContent: 'center',
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
}));

HostRequestForm.propTypes = {
  currentUser: PropTypes.object,
  reloadUser: PropTypes.func,
};

export default function HostRequestForm({ currentUser, reloadUser }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('이름은 필수 항목입니다.'),
    email: Yup.string().required('이메일은 필수 항목입니다.'),
    content: Yup.string().required('권한 신청 사유는 필수 항목입니다.'),
    affiliation: Yup.string().required('소속기관은 필수 항목입니다.'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      affiliation: currentUser?.affiliation && currentUser.affiliation === 'none' ? '' : currentUser.affiliation,
      hostUntil: 30,
      content: currentUser?.content || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const getStatus = (isPending, isHost) => {
    if (isHost) {
      return {
        label: '주최 권한 있음',
        color: 'success',
        message: '주최 권한을 보유하고 있습니다.\n이벤트를 주최해 보세요.',
      };
    }
    if (isPending) {
      return {
        label: '승인 대기 중',
        color: 'warning',
        message: `권한 신청 승인 대기 중입니다.\n신청일: ${fDateString(currentUser.requestDate)}`,
      };
    }
    return {
      label: '주최 권한 없음',
      color: 'error',
      message: '이벤트 주최 권한이 없습니다.\n주최 권한을 신청해보세요.',
    };
  };

  const status = getStatus(currentUser.isPending, currentUser.isHost);
  const isEdit = status.label === '주최 권한 없음';

  const onSubmit = async (data) => {
    try {
      await requestHost(currentUser.id, data.content);
      await reloadUser(currentUser.id);
      enqueueSnackbar('권한을 신청했습니다!');
    } catch (error) {
      console.error(error);
    }
  };

  const onRefresh = async () => {
    try {
      await reloadUser(currentUser.id);
      enqueueSnackbar('상태를 업데이트 했습니다!');
    } catch (error) {
      console.error(error);
    }
  };

  const onClickNavigate = () => {
    navigate(PATH_DASHBOARD.host.new);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            <IconButton
              onClick={onRefresh}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 18, left: 18 }}
            >
              <Iconify icon="eva:refresh-outline" />
            </IconButton>
            <Label color={status.color} sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}>
              {status.label}
            </Label>

            <Box sx={{ mb: 5 }}>
              <ImageContainer>
                {currentUser.picture && (
                  <Image
                    alt="avatar"
                    src={currentUser.picture}
                    sx={{
                      zIndex: 8,
                      overflow: 'hidden',
                      borderRadius: '50%',
                      position: 'absolute',
                      width: `calc(100% - 16px)`,
                      height: `calc(100% - 16px)`,
                    }}
                  />
                )}
                <Iconify icon="eva:person-outline" width={36} />
              </ImageContainer>
            </Box>
            <Alert severity={status.color} sx={{ whiteSpace: 'pre-wrap' }}>
              {status.message}
            </Alert>
            {currentUser.isHost && (
              <Button
                color="success"
                variant="contained"
                sx={{ mt: 3 }}
                startIcon=<Iconify icon="eva:arrowhead-left-outline" />
                onClick={onClickNavigate}
              >
                이벤트 주최하러 가기
              </Button>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
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
              <RHFTextField
                name="affiliation"
                label="소속기관"
                placeholder="소속기관을 작성해 주세요."
                disabled={!isEdit}
              />

              <RHFSelect name="hostUntil" label="희망 권한 보유기간" disabled={!isEdit}>
                {[7, 30, 365].map((option) => (
                  <option key={option} value={option}>
                    {option}일
                  </option>
                ))}
                <option value={0}>무제한</option>
              </RHFSelect>
            </Box>

            <Box sx={{ mt: 3 }}>
              <RHFTextField
                name="content"
                label="권한 신청 사유"
                placeholder="권한 신청 사유를 작성해 주세요."
                minRows={2}
                multiline
                disabled={!isEdit}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={!isEdit}>
                권한 신청
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
