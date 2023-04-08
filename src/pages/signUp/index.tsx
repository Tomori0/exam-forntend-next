import {
  Avatar,
  Box,
  Button,
  Card, CardContent,
  Container, FormControl,
  Grid, Input, InputLabel,
  Typography
} from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <div className='content-center h-screen'>
      <Box
        sx={{
          width: "100%",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <Container>
          <Grid container direction="column" alignItems="center" justifyContent="center" className='relative h-screen'>
            <Grid item xs={12}>
              <Card sx={{minWidth: '380px'}} className='absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]'>
                <CardContent>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    注册账号
                  </Typography>
                  <FormControl required sx={{ margin: '24px 0' }} fullWidth variant="standard">
                    <InputLabel htmlFor="standard-adornment-email">邮箱</InputLabel>
                    <Input
                      id="standard-adornment-email"
                      fullWidth
                      // value={...register('email')}
                    />
                  </FormControl>
                  <FormControl required sx={{ marginBottom: '24px' }} fullWidth variant="standard">
                    <InputLabel htmlFor="standard-adornment-password">密码</InputLabel>
                  </FormControl>
                  <Button className='bg-gradient-to-r w-full text-white from-[#c9aa62] to-[#c7c7c7] hover:from-[#c9aa62dd] hover:to-[#c7c7c7dd]'>
                    注册
                  </Button>
                  <div className='flex justify-end mt-[24px] text-[#949494]'>
                    <Link className='mr-5 hover:text-[#c9aa62]' href={'/forgetPassword'} >
                      忘记密码
                    </Link>
                    <Link className='hover:text-[#c9aa62]' href={'/'} >
                      已有账号
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
