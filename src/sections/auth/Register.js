import { useEffect, useState } from 'react';
// @mui
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
// layouts
import { Controller, useForm } from 'react-hook-form';
import { QrReader } from 'react-qr-reader';
import LoginLayout from '../../layouts/login';
import { DEPARTMENT_LIST } from '../../config';
import { useAuthContext } from '../../auth/useAuthContext';
import { getQRInfo } from '../../apis/qr';

// ----------------------------------------------------------------------

export default function Register() {
  const { user, logout } = useAuthContext();
  const userRegister = useAuthContext().register;
  const [resultText, setResultText] = useState('');
  const [isQRChecked, setIsQRChecked] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ defaultValues: { departmentId: 1 } });
  const onValid = async (data) => {
    if (user) {
      await userRegister(user.id, data.affiliation, data.studentNum, data.departmentId);
      reset();
    } else {
      console.error('no user info');
    }
  };

  const handleChange = (event) => {
    setIsQRChecked(event.target.checked);
  };

  const handleQRScan = async (qrString) => {
    if (qrString) {
      const reponse = await getQRInfo(qrString);
      setValue('studentNum', reponse.user_number);
    }
  };

  useEffect(() => {
    if (resultText && resultText !== '') {
      handleQRScan(resultText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultText]);

  return (
    <LoginLayout
      title="HanQ - 원타임 큐알코드를 활용하는 출입관리 서비스 플랫폼"
      illustration="/assets/images/about/screenshot.png"
    >
      <Stack spacing={5} sx={{ position: 'relative' }}>
        <Typography variant="h4">기본 정보를 입력해주세요.</Typography>

        <Box component="form" onSubmit={handleSubmit(onValid)}>
          <Box sx={{ width: 300, maxHeight: 1 }}>
            {user?.isStudent ? (
              <Box>
                <InputLabel sx={{ color: 'text.primary' }}>학번</InputLabel>
                <TextField
                  {...register('studentNum', {
                    required: '필수 입력 항목입니다.',
                    minLength: { value: 8, message: '학번 8글자를 입력해주세요.' },
                    maxLength: { value: 8, message: '학번 8글자를 입력해주세요.' },
                  })}
                  size="small"
                  placeholder="학번을 입력하세요."
                  helperText={errors.studentNum?.message}
                  error={Boolean(errors.studentNum?.message)}
                  fullWidth
                  type="number"
                />
                <Box sx={{ height: 16 }} />
                <InputLabel sx={{ color: 'text.primary' }}>학부</InputLabel>
                <FormControl fullWidth>
                  <Controller
                    name="departmentId"
                    control={control}
                    rules={{ required: '필수 입력 항목입니다.' }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        ref={register('departmentId').ref}
                        size="small"
                        error={Boolean(errors.departmentId?.message)}
                        displayEmpty
                      >
                        {DEPARTMENT_LIST.map((department, index) => (
                          <MenuItem key={index} value={index + 1}>
                            {department}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.departmentId && <FormHelperText error>{errors.departmentId.message}</FormHelperText>}
                </FormControl>
              </Box>
            ) : (
              <Box>
                <FormControlLabel
                  control={<Switch checked={isQRChecked} onChange={handleChange} name="gilad" />}
                  label="교수님 또는 교직원이신가요?"
                />
                {isQRChecked && (
                  <>
                    <Box sx={{ height: 16 }} />
                    <InputLabel sx={{ color: 'text.primary' }}>직번</InputLabel>
                    <TextField
                      {...register('studentNum')}
                      size="small"
                      placeholder="QR코드를 태깅해주세요."
                      helperText={errors.studentNum?.message}
                      error={Boolean(errors.studentNum?.message)}
                      fullWidth
                      type="number"
                      inputProps={{ readOnly: true }}
                    />
                  </>
                )}
                <Box sx={{ height: 16 }} />
                <InputLabel sx={{ color: 'text.primary' }}>소속</InputLabel>
                <TextField
                  {...register('affiliation', {
                    required: '필수 입력 항목입니다',
                  })}
                  size="small"
                  placeholder="소속을 입력하세요."
                  helperText={errors.affiliation?.message}
                  error={Boolean(errors.affiliation?.message)}
                  fullWidth
                />
              </Box>
            )}
            <Box sx={{ height: 32 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="contained" color="error" onClick={logout}>
                돌아가기
              </Button>
              <Button variant="contained" color="success" type="submit">
                가입하기
              </Button>
            </Box>
            {isQRChecked && (
              <>
                <Box sx={{ height: 48 }} />
                <Box>
                  <InputLabel sx={{ color: 'text.primary' }}>QR로 정보입력하기</InputLabel>
                  <QrReader
                    scanDelay={300}
                    onResult={(result) => {
                      if (!result) return;
                      setResultText(result.text);
                    }}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Stack>
    </LoginLayout>
  );
}
