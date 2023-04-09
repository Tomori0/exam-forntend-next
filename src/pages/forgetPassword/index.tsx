import {
  Alert,
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Container, FormControl,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import Link from 'next/link';
import * as yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useState} from 'react';
import 'dayjs/locale/zh-cn';
import Head from "next/head";

type Form = {
  email: string,
}

const schema = yup.object().shape({
  email: yup.string().required('请输入邮箱。').email('请输入正确的邮箱格式。'),
});

export default function Home() {
  const [isSuccess, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<Form>({resolver: yupResolver(schema), mode: 'onChange'})

  const onSubmit = (data: Form) => {
    setSuccess(true)
    console.log(data);
  };

  return (
    <div className='content-center h-screen'>
      <Head><title>忘记密码 - 玖义考试</title></Head>
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
                    忘记密码
                  </Typography>
                  <form>
                    <FormControl required sx={{ margin: '12px 0 24px 0' }} fullWidth variant='standard'>
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
                    <Button className='bg-gradient-to-r w-full text-white from-[#c9aa62] to-[#c7c7c7] hover:from-[#c9aa62dd] hover:to-[#c7c7c7dd]'
                            onClick={handleSubmit(onSubmit)}
                    >
                      找回密码
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
