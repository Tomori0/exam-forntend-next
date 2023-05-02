import Head from 'next/head';
import {Box, Button, Container, Pagination, Skeleton, Stack, Typography} from '@mui/material';
import {ChangeEvent, useEffect, useState} from 'react';
import serviceAxios from '../../../util/serviceAxios';
import {AxiosResponse} from 'axios';
import {useRouter} from 'next/router';
import ExamQuestion from '../../../interface/ExamQuestion';
import Page from '../../../interface/Page';
import * as CryptoJS from 'crypto-js';

export default function Question() {

  const router = useRouter();

  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [question, setQuestion] = useState<ExamQuestion|null>(null)
  const [answer, setAnswer] = useState<string>('查看答案')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    serviceAxios({
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
    }).then((response: AxiosResponse<Page<ExamQuestion[]>>) => {
      if (response.status !== 200) {

      } else {
        const data = response.data
        if (data.empty) {
        } else {
          setAnswer('查看答案')
          setTotalPage(data.totalPages)
          setQuestion(data.content[0])
          setToken(response.statusText)
        }
        setIsLoading(false)
      }
    }).catch(error => {
      console.log(error)
    })
  }, [router.query.infoId, currentPage])

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  function encode(secret: string, message: string) {

    const key = CryptoJS.enc.Base64.parse(secret);
    const encryptedBytes = CryptoJS.AES.encrypt(message, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encryptedBytes.toString();
  }

  const handleGetAnswer = () => {
    const infoId = router.query.infoId as string ?? ''
    const questionId = question?.questionId ?? ''
    const date = new Date()
    console.log(token)
    console.log(infoId + questionId.toString() + date.getTime() + token)
    const message = infoId + questionId.toString() + date.getTime() + token
    const verify = encode(token, message)
    serviceAxios({
      url: '/api/exam/question/answer',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: {
        infoId: router.query.infoId,
        questionId: question?.questionId,
        timestamp: date.getTime(),
        verify: verify
      }
    }).then((response: AxiosResponse<string>) => {
      if (response.status !== 200) {

      } else {
        setAnswer(response.data)
      }
    }).catch(error => {
      console.log(error)
    })
  };

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
                        // <Button variant='outlined' className='w-full text-left justify-start mt-2 mb-2 bg-[#90caf9] text-black hover:bg-[#a6d4fa]'>
                        <Button variant='contained' className='bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[#c9aa62] to-[#c7c7c7] text-white'>
                          {key}. {value as string}
                        </Button>
                      )
                    }) : ''
                  }
                  <Button variant='contained' className='bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[#c9aa62] to-[#c7c7c7] text-white'
                    onClick={handleGetAnswer}>
                    {answer}
                  </Button>
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