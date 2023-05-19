import Head from 'next/head';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions, DialogContent, DialogContentText,
  DialogTitle,
  Pagination,
  Skeleton,
  Stack, TextField,
  Typography
} from '@mui/material';
import {DataGrid, GridColDef} from '@mui/x-data-grid'
import {ChangeEvent, MouseEvent, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import ExamQuestion from '../../../interface/ExamQuestion';
import Page from '../../../interface/Page';
// import * as CryptoJS from 'crypto-js';
import useServiceAxios from "../../../util/useServiceAxios";
import ExamDetail from "../../../interface/ExamDetail";
import moment from "moment";

interface Answer {
  id: number
  answer: string
  checkFlag: boolean
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'answer', headerName: '作答', width: 150 },
]

export default function Question() {

  const router = useRouter();

  const [totalPage, setTotalPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [question, setQuestion] = useState<ExamQuestion|null>(null)
  const [examInfo, setExamInfo] = useState<ExamDetail|null>(null)
  const [answer, setAnswer] = useState<Array<Answer>>(new Array<Answer>(0))
  const [endTime, setEndTime] = useState<Date>(new Date())
  const [countDownTime, setCountDownTime] = useState<string>('00:00:00')
  const [open, setOpen] = useState<boolean>(false)
  const [inputAnswer, setInputAnswer] = useState<string>('')

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
        const [hour, minute, second] = response.data.expireTime?.split(":").map(Number) as [number, number, number]
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        const resultHour = currentHour + hour;
        const resultMinute = currentMinute + minute;
        const resultSecond = currentSecond + second;
        const resultDate = new Date();
        resultDate.setHours(resultHour);
        resultDate.setMinutes(resultMinute);
        resultDate.setSeconds(resultSecond);
        setEndTime(resultDate)
      }
    }
    fetchData()
  }, [router.query.infoId])

  useEffect(() => {
    const countDown = setInterval(() => {
      if (endTime.getTime() - new Date().getTime() > 0) {
        const times = moment(endTime).diff(moment(new Date()), 's')
        const hours = parseInt(`${(times / 60 / 60) % 24}`); //计算小时数 转化为整数
        const minutes = parseInt(`${(times / 60) % 60}`); //计算分钟数 转化为整数
        const seconds = parseInt(`${times % 60}`); //计算描述 转化为整数
        // countDownTimeRef.current = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
        setCountDownTime(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
      } else {
        setCountDownTime('00:00:00')
      }
    }, 1000)

    return () => clearInterval(countDown);
  }, [examInfo])

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
          if (answer.length === 0) {
            const length = data.totalPages
            setAnswer(Array.from({ length }, (_, index) => ({
              id: index + 1,
              answer: '',
              checkFlag: false,
            })))
          }
          setTotalPage(data.totalPages)
          setQuestion(data.content[0])
          setInputAnswer(answer[currentPage - 1].answer)
        }
        setIsLoading(false)
      }
    }
    fetchData()
  }, [router.query.infoId, currentPage])

  const handleChangePage = (event: ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
  };

  // function encode(secret: string, message: string) {
  //   const key = CryptoJS.enc.Base64.parse(secret);
  //   const encryptedBytes = CryptoJS.AES.encrypt(message, key, {
  //     mode: CryptoJS.mode.ECB,
  //   });
  //   return encryptedBytes.toString();
  // }

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (question?.questionType === 1) {
      const selectedAnswer = e.currentTarget.id.replace('answer-', '')
      if (inputAnswer === '' || inputAnswer.indexOf(selectedAnswer) === -1) {
        setInputAnswer(selectedAnswer)
        answer[currentPage - 1].answer = selectedAnswer
      } else {
        setInputAnswer('')
        answer[currentPage - 1].answer = ''
      }
    } else if (question?.questionType === 2) {
      const selectedAnswer = e.currentTarget.id.replace('answer-', '')
      if (inputAnswer.indexOf(selectedAnswer) > -1) {
        setInputAnswer(inputAnswer.replace(selectedAnswer, ''))
        answer[currentPage - 1].answer = answer[currentPage - 1].answer.replace(selectedAnswer, '')
      } else {
        setInputAnswer(Array.from(new Set(inputAnswer + e.currentTarget.id.replace('answer-', '').split(''))).sort().join(''))
        answer[currentPage - 1].answer += e.currentTarget.id.replace('answer-', '')
        answer[currentPage - 1].answer = Array.from(new Set(answer[currentPage - 1].answer.split(''))).sort().join('')
      }
    }
  }

  const preSubmit = () => {
    setOpen(true)
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
              <div className='flex content-center'>
                <div className='flex-1'>
                  <Typography variant='body1' component='div' sx={{margin: '12px 0', whiteSpace: 'pre-line'}}>
                    考试剩余时间：{countDownTime}
                  </Typography>
                </div>
                <Button variant='contained'
                        className={`justify-start mt-2 mb-2 text-white bg-[#90caf9]`}
                        onClick={preSubmit}>
                  提交
                </Button>
              </div>
              {question ?
                <>
                  <Typography variant='h6' component='span' sx={{margin: '12px 0', whiteSpace: 'pre-line'}}>
                    {question.questionHead}
                  </Typography>
                  <div>
                    {question.questionBody ?
                      Object.entries(JSON.parse(question.questionBody)).map(([key, value]) => {
                        return (
                          <Button id={`answer-${key}`} key={value as string} variant='contained'
                                  className={`bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 from-[${inputAnswer.includes(key) ? '#90caf9': '#c9aa62'}] to-[#c7c7c7] text-white`}
                                  onClick={handleClick}>
                            {key}. {value as string}
                          </Button>
                        )
                      }) :
                      <TextField
                        id="outlined-multiline-static"
                        label="作答区"
                        multiline
                        fullWidth
                        rows={4}
                        onChange={e => setInputAnswer(e.target.value)}
                        onBlur={() => {answer[currentPage - 1].answer = inputAnswer}}
                        value={inputAnswer}
                      />
                    }
                  </div>
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
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle id="alert-dialog-title">
              {"检查"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                您可以在以下列表中检查您的作答，并且通过前面的勾选框来标记检查完成的试题。
              </DialogContentText>
              <DataGrid
                sx={{
                  marginTop: '12px',
                  '& .Mui-selected': {
                    color: 'black !important',
                  },
                }}
                rows={answer}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button className={`text-white bg-[#c9aa62] hover:bg-[#c9aa62bb]`} onClick={() => console.log('submit')} autoFocus>
                提交
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  )
}