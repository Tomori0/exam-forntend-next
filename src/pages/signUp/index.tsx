import {
  Alert,
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Container, Divider, FormControl, FormHelperText,
  Grid, IconButton, Input, InputAdornment, InputLabel, Snackbar, TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import {ChangeEvent, useEffect, useRef, useState} from 'react';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz'
import zhCN from 'date-fns/locale/zh-CN'
import {LocalizationProvider, MobileDatePicker} from '@mui/x-date-pickers';
import Head from 'next/head';
import serviceAxios from '../../../util/serviceAxios';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {AxiosResponse} from "axios";
import {LoginResponse} from "../../../interface/LoginResponse";
import {useRouter} from "next/router";

type Form = {
  email: string,
  nickname: string,
  password: string,
  confirmPassword: string,
  birthday: Date,
}

const schema = yup.object().shape({
  email: yup.string().required('请输入邮箱。').email('请输入正确的邮箱格式。'),
  nickname: yup.string().required('请输入用户名。').max(16, '用户名不能超过16个字符。').min(3, '用户名至少3个字符。'),
  password: yup.string().required('请输入密码。').matches(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/, '密码满足大小写字母，数字和特殊字符中任意三种(8-16位)'),
  confirmPassword: yup.string().required('请输入确认密码。').oneOf([yup.ref('password')], '两次密码不一致。'),
  birthday: yup.date().required('请选择出生日期。').max(new Date(), '日期不能大于当前日期。'),
});

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successToken, setSuccessToken] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [verifyCode, setVerifyCode] = useState<string>('');
  const resendTimeRef = useRef<Date|undefined>(undefined);
  const countDownTimeRef = useRef<Date|undefined>(undefined);

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  const handleVerifyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifyCode(e.target.value.toUpperCase())
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDownTimeRef.current !== undefined && resendTimeRef.current !== undefined) {
        const newTime = new Date(countDownTimeRef.current.getTime() + 1000); // 添加3分钟的毫秒数
        if (newTime.getTime() > resendTimeRef.current.getTime()) {
          resendTimeRef.current = undefined
          countDownTimeRef.current = undefined
        } else {
          countDownTimeRef.current = newTime
          const countdownElement = document.getElementById('countdown');
          if (countdownElement !== null) {
            countdownElement.textContent = `已重新发送验证码，距离下一次重新发送还剩 ${format(new Date(resendTimeRef.current.getTime() - countDownTimeRef.current.getTime()), 'mm:ss')}`;
          }
        }
      }
    }, 1000); // 每秒钟更新一次时间

    return () => clearInterval(interval);
  }, [countDownTimeRef.current]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch
  } = useForm<Form>({resolver: yupResolver(schema), mode: 'onChange'})

  const onSubmit = (data: Form) => {
    serviceAxios({
      url: '/api/auth/register',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: data,
    }).then((response) => {
      if (response.status !== 200) {
        setIsError(true)
        setErrorMessage(response.statusText)
      } else {
        setIsSuccess(true)
        setSuccessToken(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  };

  const onVerifyEmail = () => {
    serviceAxios({
      url: '/api/auth/verify',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: {
        email: watch('email'),
        token: successToken,
        verifyCode: verifyCode
      }
    }).then((response: AxiosResponse<LoginResponse>) => {
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data.token)
        sessionStorage.setItem('tokenHead', response.data.tokenHead)
        router.push('/dashboard')
      }
    }).catch(error => {
      console.log(error)
    })
  };

  const onResend = () => {
    const date = new Date(new Date().getTime() + 3 * 60 * 1000)
    countDownTimeRef.current = new Date()
    resendTimeRef.current = date
  }

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
                        error={Boolean(errors.nickname)}
                        helperText={errors.nickname?.message}
                        inputProps={{
                          maxLength: 16
                        }}
                        {...register<keyof Form>('nickname')}
                      />
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                        <Controller
                          name='birthday'
                          control={control}
                          defaultValue={new Date()}
                          render={({ field }) => (
                          <MobileDatePicker
                            label='生日'
                            value={field.value}
                            onChange={(e) => {
                              if (e instanceof Date)
                                e = zonedTimeToUtc(e, Intl.DateTimeFormat().resolvedOptions().timeZone)
                              field.onChange(e)
                            }}
                            inputFormat='yyyy/MM/dd'
                            renderInput={(params) => (
                              <TextField {...params} required error={!!errors.birthday} helperText={errors?.birthday?.message} variant='standard' />
                            )}
                          />
                          )}
                        />
                      </LocalizationProvider>
                    </FormControl>
                    <FormControl required sx={{ margin: '12px 0' }} fullWidth variant='standard'>
                      <InputLabel htmlFor='password-input'>密码</InputLabel>
                      <Input
                        id='password-input'
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
                      <InputLabel htmlFor='confirm-password-input'>确认密码</InputLabel>
                      <Input
                        id='confirm-password-input'
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
              <Snackbar open={isError} autoHideDuration={6000} onClose={() => setIsError(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={() => setIsError(false)} severity='error' sx={{ width: '100%' }}>
                  {errorMessage}
                </Alert>
              </Snackbar>
              <div className={`absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] ${isSuccess || 'hidden'}`}>
                <Avatar sx={{ width: 86, height: 86, border: '3px solid #fff', backgroundColor: 'transparent', margin: '0 auto' }}><EmailIcon sx={{width: 56, height: 56}}/></Avatar>
                <Typography variant='h4' component='h4' mt={3} sx={{textAlign: 'center'}}>
                  请验证您的邮箱
                </Typography>
                <Box mt={3} sx={{textAlign: 'center'}}>
                  <Typography>
                    请输入已发送至 {watch('email')} 的验证码。
                  </Typography>
                  <Typography>
                    该验证码的有效期为30分钟。
                  </Typography>
                </Box>
                <Box component='div' mt={3} width={190} sx={{marginLeft: 'auto', marginRight: 'auto'}}>
                  <TextField
                    fullWidth
                    size='small'
                    variant='outlined'
                    value={verifyCode}
                    inputProps={{
                      maxLength: 6,
                      style: {
                        textAlign: 'center',
                        letterSpacing: '.9em',
                        paddingLeft: '1.5em',
                        width: '100%',
                      },
                    }}
                    onChange={handleVerifyChange}
                    sx={{margin: '0 auto'}}
                  />
                </Box>
                <Box component='div' mt={3}>
                  <Button className='block bg-gradient-to-r w-[260px] text-white from-[#c9aa62] to-[#c7c7c7] hover:from-[#c9aa62dd] hover:to-[#c7c7c7dd] ml-auto mr-auto'
                          onClick={handleSubmit(onVerifyEmail)}
                  >
                    验证邮箱
                  </Button>
                  <div className={`text-center mt-3 ${resendTimeRef.current !== undefined && 'hidden' }`}>
                    <p className='text-xs underline hover:cursor-pointer hover:no-underline' onClick={onResend}>重新发送验证码</p>
                  </div>
                  <div className={`text-center mt-3 ${resendTimeRef.current === undefined && 'hidden' }`}>
                    <p className='text-xs' id='countdown'>
                      {`已重新发送验证码，距离下一次重新发送还剩 ${resendTimeRef.current !== undefined && countDownTimeRef.current !== undefined ? format(new Date(resendTimeRef.current.getTime() - countDownTimeRef.current.getTime()), 'MM:dd') : null}`}
                    </p>
                  </div>
                </Box>
                <Divider sx={{marginTop: '1.5em', marginBottom: '1.5em'}}/>
                <Box component='div'>
                  <div className='text-center text-sm'>
                    <p>如果您在收件箱中没有看到它，请检查您的垃圾邮件文件夹。</p>
                  </div>
                </Box>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
