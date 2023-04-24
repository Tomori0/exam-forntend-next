import Head from 'next/head';
import ExamList from '../../../interface/ExamList';
import {Avatar, Box, Card, CardContent, Container, Unstable_Grid2 as Grid, Typography} from '@mui/material';
import {useEffect} from 'react';

export default function Dashboard() {

  const testData: ExamList[] = [{
    categoryName: 'Linux Professional Institute',
    examDetailList: [{
      examId: 1,
      examCode: 'lpic101-500',
      examName: 'LPI 101-500 Exam',
      categoryId: '291d411634ecbbc2c8e9547febe637d5'
    }, {
      examId: 2,
      examCode: 'lpic102-500',
      examName: 'LPI 102-500 Exam',
      categoryId:'291d411634ecbbc2c8e9547febe637d5'
    }]}, {
    categoryName: 'Salesforce',
    examDetailList: [{
      examId: 3,
      examCode: 'sfCertifiedAdvancedAdministrator',
      examName: 'Salesforce Certified Advanced Administrator Exam',
      categoryId: '8ec8e5b31acf36ea3119df7525773376'
    }, {
      examId: 4,
      examCode: 'ADM-201-JPN',
      examName: 'Salesforce Certified Administrator Japanese',
      categoryId: '8ec8e5b31acf36ea3119df7525773376'
    }]
  }]

  useEffect(() => {
    console.log(testData)
  }, [])

  return (
    <div className='content-center h-screen'>
      <Head><title>考试 - 玖义考试</title></Head>
      <Box
        sx={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
          margin: '0 auto'
        }}
      >
        <Container>
          <Grid container spacing={2} columns={24}>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid xs={24} md={12} lg={8}>
              <Card className={'w-full'}>
                <CardContent sx={{margin: '12px'}}>
                  <Avatar src='/images/logo.svg' sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                  <Typography align='center' variant='h5' component='p'>
                    忘记密码
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  )
}
