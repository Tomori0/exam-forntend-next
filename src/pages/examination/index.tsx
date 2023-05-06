import Head from 'next/head';
import ExamList from '../../../interface/ExamList';
import {Avatar, Box, Card, CardContent, Container, Typography, Unstable_Grid2 as Grid} from '@mui/material';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import useServiceAxios from "../../../util/useServiceAxios";
import {useRouter} from "next/router";

export default function Examination() {

  const [examList, setExamList] = useState<ExamList[]|undefined>(undefined)
  const router = useRouter()
  useEffect(() => {
    async function fetchData() {
      const response = await useServiceAxios<ExamList[], any>({
        url: '/api/exam/info/list',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      }, router)
      if (response.status !== 200) {
        alert(response.statusText)
      } else {
        const data = response.data;
        data.sort((a, b) => {
          return a.categoryId - b.categoryId
        })
        data.forEach(ele => {
          ele.infoList.sort((a, b) => {
            return b.infoId - a.infoId
          })
        })
        setExamList(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <Head><title>考试 - 玖义考试</title></Head>
      <Box
        sx={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
          margin: '0 auto'
        }}
      >
        <Container>
          {examList ?
            examList.map(exam => {
              return (
                <Grid key={exam.categoryId} container spacing={2} columns={24}>
                  <Grid xs={24}>
                    <Typography variant='h4' component='p' sx={{margin: '12px 0'}}>
                      {exam.categoryName}
                    </Typography>
                  </Grid>
                  {exam.infoList.map(info => {
                    return (
                      <Grid key={info.infoId} xs={24} md={12} lg={8}>
                        <Link href={'/question?infoId=' + info.infoId}>
                          <Card className={'w-full'}>
                            <CardContent sx={{margin: '12px'}}>
                              <Avatar src={info.examLogo ?? '/images/logo.svg'} sx={{width: '86px', height: '86px', margin: '24px auto'}}></Avatar>
                              <Typography align='center' variant='h5' component='div'
                                          sx={{height: '3.5em', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                {info.examTitle}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      </Grid>
                    )
                  })}
                </Grid>
              )
            })
            : ''}
        </Container>
      </Box>
    </div>
  )
}
