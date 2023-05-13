import Head from 'next/head';
import {Box, Button, Container, Pagination, Skeleton, Stack, Typography} from '@mui/material';
import {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import ExamQuestion from '../../../interface/ExamQuestion';
import Page from '../../../interface/Page';
// import * as CryptoJS from 'crypto-js';
import useServiceAxios from "../../../util/useServiceAxios";
import ExamDetail from "../../../interface/ExamDetail";

export default function Question() {

  const router = useRouter();

  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [question, setQuestion] = useState<ExamQuestion|null>(null)
  const [examInfo, setExamInfo] = useState<ExamDetail|null>(null)
  const [answer, setAnswer] = useState<Array<string>>(new Array<string>(0))

  useEffect(() => {
    const fetchData = async () => {
      const response = await useServiceAxios<ExamDetail, any>({
        url: '/api/exam/info/get',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        params: {
          infoId: router.query.infoId
        }
      }, router)
      if (response.status !== 200) {

      } else {
        setExamInfo(response.data)
      }
    }
    fetchData()
  }, [router.query.infoId])

  useEffect(() => {
    console.log(answer)
    console.log(examInfo)
    const fetchData = async () => {
      const response = await useServiceAxios<Page<ExamQuestion[]>, any>({
        url: '/api/exam/question/get',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        params: {
          infoId: router.query.infoId,
          size: 1,
          page: currentPage - 1
        }
      }, router)
      if (response.status !== 200) {

      } else {
        const data = response.data
        if (data.empty) {
        } else {
          if (answer.length === 0) {
            setAnswer(new Array<string>(data.totalPages).fill(''))
          }
          setTotalPage(data.totalPages)
          setQuestion(data.content[0])
        }
        setIsLoading(false)
      }
    }
    fetchData()
  }, [router.query.infoId, currentPage])

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // function encode(secret: string, message: string) {
  //   const key = CryptoJS.enc.Base64.parse(secret);
  //   const encryptedBytes = CryptoJS.AES.encrypt(message, key, {
  //     mode: CryptoJS.mode.ECB,
  //   });
  //   return encryptedBytes.toString();
  // }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.className.includes('from-[#c9aa62]')) {
      // 选择
      e.currentTarget.className = e.currentTarget.className.replace('from-[#c9aa62]', 'from-[#90caf9]')
      answer[currentPage - 1] += e.currentTarget.id.replace('answer-', '')
      answer[currentPage - 1] = answer[currentPage - 1].split('').sort().join('')
    } else {
      // 取消
      e.currentTarget.className = e.currentTarget.className.replace('from-[#90caf9]', 'from-[#c9aa62]')
    }
  }

  return (
    <div>
      <Head><title>试题 - 玖义考试</title></Head>
      <Box
        sx={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
          margin: '0 auto'
        }}
      >
        <Container>
          {isLoading ?
            <div>
              <Skeleton variant='rectangular' width={210} height={60} />
              <Skeleton variant='rounded' width={210} height={60} />
            </div>
            :
            <>
              {question ?
                <>
                  <Typography variant='h6' component='span' sx={{margin: '12px 0', whiteSpace: 'pre-line'}}>
                    {question.questionHead}
                  </Typography>
                  {question.questionBody ?
                    Object.entries(JSON.parse(question.questionBody)).map(([key, value]) => {
                      return (
                        <Button id={`answer-${key}`} key={value as string} variant='contained'
                                className={`bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[${answer[currentPage - 1].includes(key) ? '#90caf9': '#c9aa62'}] to-[#c7c7c7] text-white`}
                                onClick={handleClick}>
                          {key}. {value as string}
                        </Button>
                      )
                    }) : ''
                  }
                  <div className={'flex justify-center mt-2'}>
                    <Stack spacing={2}>
                      <Pagination count={totalPage} page={currentPage} onChange={handleChangePage} color='primary' />
                    </Stack>
                  </div>
                </>
                :
                <></>
              }
            </>
          }
        </Container>
      </Box>
    </div>
  )
}