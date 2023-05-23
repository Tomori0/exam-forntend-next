import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
  TextField,
  Typography
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {KeyboardEvent, useState} from 'react';
import Link from 'next/link';
import {useForm} from 'react-hook-form';
import Head from 'next/head';
import serviceAxios from '../../util/serviceAxios';
import {AxiosResponse} from 'axios';
import {LoginResponse} from '../../interface/LoginResponse';
import {useRouter} from 'next/router';

type Form = {
  email: string,
  password: string,
}

const schema = yup.object().shape({
  email: yup.string().required('请输入邮箱。').email('请输入正确的邮箱格式。'),
  password: yup.string().required('请输入密码。').matches(/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/, '密码满足大小写字母，数字和特殊字符中任意三种(8-16位)'),
});


export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isError, setIsError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver: yupResolver(schema), mode: 'onChange' });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSubmit(onSubmit)()
    } else {
      return event
    }
  };

  const onSubmit = async (data: Form) => {
    // const response: AxiosResponse<LoginResponse> = await
    serviceAxios({
      url: '/api/auth/login',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {username: data.email, password: data.password},
    }).then((response: AxiosResponse<LoginResponse>) => {
      if (response.status === 200) {
        sessionStorage.setItem('token', response.data.token)
        sessionStorage.setItem('tokenHead', response.data.tokenHead)
        router.push('/dashboard')
      } else {
        setErrorMessage(response.statusText)
        setIsError(true)
      }
    }).catch(error => {
      console.log(error)
    })
  };

  return (
    <div>
      <Head><title>登录 - 玖义考试</title></Head>
      <Box
        sx={{
          width: '100%'
        }}
      >
        <Container>
          <Grid container direction='column' alignItems='center' justifyContent='center' className='relative h-screen'>
            <Grid item xs={12}>
              <Card sx={{width: '380px'}} className='absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    登录账号
                  </Typography>
                  <form>
                    <FormControl required sx={{ margin: '24px 0' }} fullWidth variant='standard'>
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
                    <FormControl required sx={{ marginBottom: '24px' }} fullWidth variant='standard'>
                      <InputLabel htmlFor='standard-adornment-password'>密码</InputLabel>
                      <Input
                        id='standard-adornment-password'
                        fullWidth
                        {...register<keyof Form>('password')}
                        error={Boolean(errors.password)}
                        type={showPassword ? 'text' : 'password'}
                        inputProps={{maxLength: 16, onKeyDown: handleKeyDown}}
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
                    <Button className='bg-gradient-to-r w-full text-white from-[#c9aa62] to-[#c7c7c7] hover:from-[#c9aa62dd] hover:to-[#c7c7c7dd]'
                            onClick={handleSubmit(onSubmit)}
                    >
                      登录
                    </Button>
                  </form>
                  <div className='flex justify-end mt-[24px] text-[#949494]'>
                    <Link className='mr-5 hover:text-[#c9aa62]' href={'/forgetPassword'} >
                      忘记密码
                    </Link>
                    <Link className='hover:text-[#c9aa62]' href={'/signUp'} >
                      免费注册
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Snackbar open={isError} autoHideDuration={6000} onClose={() => setIsError(false)} anchorOrigin={{vertical: 'top', horizontal: 'center'}}>
                <Alert onClose={() => setIsError(false)} severity='error' sx={{ width: '100%' }}>
                  {errorMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
