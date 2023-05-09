// @mui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// layouts
import { Controller, useForm } from 'react-hook-form';
import LoginLayout from '../../layouts/login';
import { DEPARTMENT_LIST } from '../../config';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function Register() {
  const { user, studentRegister, otherRegister, logout } = useAuthContext();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { departmentId: 1 } });
  const onValid = async (data) => {
    if (user) {
      if (user.isStudent) {
        await studentRegister(user.id, +data.studentId, data.departmentId);
      } else {
        await otherRegister(user.id, data.affiliation);
      }
      reset();
    } else {
      console.error('no user info');
    }
  };

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
                  {...register('studentId', {
                    required: '필수 입력 항목입니다',
                    minLength: { value: 8, message: '학번 8글자를 입력해주세요.' },
                    maxLength: { value: 8, message: '학번 8글자를 입력해주세요.' },
                  })}
                  size="small"
                  placeholder="학번을 입력하세요."
                  helperText={errors.studentId?.message}
                  error={Boolean(errors.studentId?.message)}
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
          </Box>
        </Box>
      </Stack>
    </LoginLayout>
  );
}
