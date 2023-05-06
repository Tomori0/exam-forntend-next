import Head from 'next/head';
import {Box, Button, Container, Pagination, Skeleton, Stack, Typography} from '@mui/material';
import {ChangeEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import ExamQuestion from '../../../interface/ExamQuestion';
import Page from '../../../interface/Page';
import * as CryptoJS from 'crypto-js';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import useServiceAxios from "../../../util/useServiceAxios";

export default function Question() {

  const router = useRouter();

  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [question, setQuestion] = useState<ExamQuestion|null>(null)
  const [answer, setAnswer] = useState<string>('查看答案')
  const [token, setToken] = useState<string>('')

  useEffect(() => {
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
          setAnswer('查看答案')
          setTotalPage(data.totalPages)
          setQuestion(data.content[0])
          setToken(response.statusText)
        }
        setIsLoading(false)
      }
    }
    fetchData()
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

  const handleGetAnswer = async () => {
    if (answer !== '查看答案') {
      return
    }
    const infoId = router.query.infoId as string ?? ''
    const questionId = question?.questionId ?? ''
    const date = new Date()
    const message = infoId + questionId.toString() + date.getTime() + token
    const verify = encode(token, message)
    const response = await useServiceAxios<string, any>({
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
    }, router)
    if (response.status !== 200) {

    } else {
      const md = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(response.data)
      setAnswer(String(md))
    }
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
                        <Button key={key} variant='contained' className='bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[#c9aa62] to-[#c7c7c7] text-white'>
                          {key}. {value as string}
                        </Button>
                      )
                    }) : ''
                  }
                  <Button variant='contained' className='bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[#c9aa62] to-[#c7c7c7] text-white'
                    onClick={handleGetAnswer}>
                    <div dangerouslySetInnerHTML = {{ __html: answer }}></div>
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