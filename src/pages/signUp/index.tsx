import {
  Alert,
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Container, FormControl, FormHelperText,
  Grid, IconButton, Input, InputAdornment, InputLabel, TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import {useState} from 'react';
import 'dayjs/locale/zh-cn';
import {LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Head from "next/head";

type Form = {
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  birthday: Date,
}

const schema = yup.object().shape({
  email: yup.string().required('请输入邮箱。').email('请输入正确的邮箱格式。'),
  username: yup.string().required('请输入用户名。').max(16, '用户名不能超过16个字符。').min(3, '用户名至少3个字符。'),
  password: yup.string().required('请输入密码。').matches(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/, '密码满足大小写字母，数字和特殊字符中任意三种(8-16位)'),
  confirmPassword: yup.string().required('请输入确认密码。').oneOf([yup.ref('password')], '两次密码不一致。'),
  birthday: yup.date().required('请选择出生日期。').max(new Date(), '日期不能大于当前日期。'),
});

export default function SignUp() {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm<Form>({resolver: yupResolver(schema), mode: 'onChange'})

  const onSubmit = (data: Form) => {
    setSuccess(true)
    console.log(data);
  };

  return (
    <div className='content-center h-screen'>
      <Head><title>注册 - 玖义考试</title></Head>
      <Box
        sx={{
          width: '100%',
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      >
        <Container>
          <Grid container direction='column' alignItems='center' justifyContent='center' className='relative h-screen'>
            <Grid item xs={12}>
              <Card sx={{width: '380px'}} className={`absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ${isSuccess && 'hidden'}`}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    注册账号
                  </Typography>
                  <form>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <TextField
                        label='邮箱'
                        required
                        fullWidth
                        variant='standard'
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message}
                        {...register<keyof Form>('email')}
                      />
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <TextField
                        label='用户名'
                        required
                        fullWidth
                        variant='standard'
                        error={Boolean(errors.username)}
                        helperText={errors.username?.message}
                        inputProps={{
                          maxLength: 16
                        }}
                        {...register<keyof Form>('username')}
                      />
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'zh-cn'}>
                        <Controller
                          name='birthday'
                          control={control}
                          defaultValue={new Date()}
                          render={({ field }) => (
                          <MobileDatePicker
                            label='生日'
                            value={field.value}
                            onChange={(e) => field.onChange(e)}
                            inputFormat='YYYY/MM/DD'
                            renderInput={(params) => (
                              <TextField {...params} required error={!!errors.birthday} helperText={errors?.birthday?.message} variant='standard' />
                            )}
                          />
                          )}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <InputLabel htmlFor='standard-adornment-password'>密码</InputLabel>
                      <Input
                        id='standard-adornment-password'
                        fullWidth
                        {...register<keyof Form>('password')}
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 16}}
                        aria-describedby={'password-error-text'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={handleClickShowPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText sx={{color: 'error.main'}} id='password-error-text'>{errors.password?.message}</FormHelperText>
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0 24px 0' }} fullWidth variant='standard'>
                      <InputLabel htmlFor='standard-adornment-password'>确认密码</InputLabel>
                      <Input
                        id='standard-adornment-password'
                        fullWidth
                        {...register<keyof Form>('confirmPassword')}
                        error={Boolean(errors.confirmPassword)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 16}}
                        aria-describedby={'confirm-password-error-text'}
                        endAdornment={
                          <InputAdornment position='end'>
                            <IconButton
                              aria-label='toggle password visibility'
                              onClick={handleClickShowConfirmPassword}
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <FormHelperText sx={{color: 'error.main'}} id='confirm-password-error-text'>{errors.confirmPassword?.message}</FormHelperText>
                    </FormControl>
                    <Button className='bg-gradient-to-r w-full text-white from-[#c9aa62] to-[#c7c7c7] hover:from-[#c9aa62dd] hover:to-[#c7c7c7dd]'
                            onClick={handleSubmit(onSubmit)}
                    >
                      注册
                    </Button>
                  </form>
                  <div className='flex justify-end mt-[24px] text-[#949494]'>
                    <Link className='hover:text-[#c9aa62]' href={'/'} >
                      已有账号
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Alert className={`absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ${isSuccess || 'hidden'}`} severity="success">
                {`请前往邮箱 ${watch('email')} 验证`}
              </Alert>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
