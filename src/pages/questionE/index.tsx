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
import {DataGrid, GridCellParams, GridColDef} from '@mui/x-data-grid'
import {ChangeEvent, MouseEvent, useEffect, useRef, useState} from 'react';
import {useRouter} from 'next/router';
import ExamQuestion from '../../../interface/ExamQuestion';
import Page from '../../../interface/Page';
import * as CryptoJS from 'crypto-js';
import useServiceAxios from "../../../util/useServiceAxios";
import ExamDetail from "../../../interface/ExamDetail";
import moment from "moment";

interface Answer {
  id: number
  answer: string
  correctAnswer: string
}

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
  const [submitOpen, setSubmitOpen] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<string>('')
  const [tipsOpen, setTipsOpen] = useState<boolean>(false)
  const [tipsMessage] = useState<string>('距离考试结束还剩5分钟，时间到后将会自动提交')
  const [inputAnswer, setInputAnswer] = useState<string>('')
  const hasTipsOpen = useRef<boolean>(false)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90,
      renderCell: (params: GridCellParams<Answer>) => {
        const page = params.row.id;
        return <div className={'hover:cursor-pointer'} onClick={() => {
          setCurrentPage(page)
          setOpen(false)
        }}>{page}</div>
      },
    },
    { field: 'answer', headerName: '作答', width: 150 },
    { field: 'correctAnswer', headerName: '正确答案', width: 150,
      renderCell: (params: GridCellParams<Answer>) => {
        if (params.row.correctAnswer !== '') {
          return <div className={`${params.row.correctAnswer == params.row.answer ? 'bg-green-600' : 'bg-red-600'} w-full h-full leading-[52px]`}>{params.row.correctAnswer}</div>
        } else {
          return <div>{params.row.correctAnswer}</div>
        }
      }
    }
  ]

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
        setCountDownTime(`${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)
        if (hours === 0 && minutes < 5 && !hasTipsOpen.current) {
          hasTipsOpen.current = true
          setTipsOpen(true)
        }
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
              correctAnswer: '',
            })))
          } else {
            setInputAnswer(answer[currentPage - 1].answer)
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
    setCurrentPage(value)
  };

  function encode(secret: string, message: string) {
    const key = CryptoJS.enc.Base64.parse(secret);
    const encryptedBytes = CryptoJS.AES.encrypt(message, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encryptedBytes.toString();
  }

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

  const checkSubmit = () => {
    setOpen(true)
  }

  const preSubmit = () => {
    if (answer.filter((item) => item.answer === '').length > 0) {
      setSubmitMessage('还有题没做完，确定要提交吗？')
    } else {
      setSubmitMessage('确定提交')
    }
    setSubmitOpen(true)
  }

  const handleSubmit = async () => {
    const submitAnswer: string[] = []
    answer.forEach(ele => {submitAnswer.push(ele.answer)})
    const infoId = router.query.infoId as string ?? ''
    const date = new Date()
    const message = infoId + date.getTime() + examInfo?.token + '[' + submitAnswer.join(',') + ']'
    console.log(message)
    const verify = encode(examInfo?.token ? examInfo.token : '', message)
    const response = await useServiceAxios<string[], any>({
      url: '/api/exam/question/submit',
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      data: {
        infoId: router.query.infoId,
        answer: submitAnswer,
        timestamp: date.getTime(),
        verify: verify
      }
    }, router)
    if (response.status !== 200) {

    } else {
      response.data.forEach((value, index) => {
        answer[index].correctAnswer = value
      })
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
              <div className='flex content-center'>
                <div className='flex-1'>
                  <Typography variant='body1' component='div' sx={{margin: '12px 0', whiteSpace: 'pre-line'}}>
                    考试剩余时间：{countDownTime}
                  </Typography>
                </div>
                <Button variant='contained'
                        className={`justify-start mt-2 mb-2 text-white bg-[#90caf9]`}
                        onClick={checkSubmit}>
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
                          <Button id={`answer-${key}`} key={key} variant='contained' sx={{justifyContent: 'flex-start', marginTop: '0.5rem', marginBottom: '0.5rem'}}
                                  className={`bg-gradient-to-r w-full text-left justify-start mt-2 mb-2 ${inputAnswer.includes(key) ? 'from-[#90caf9]' : 'from-[#c9aa62]'} to-[#c7c7c7]`}
                                  onClick={handleClick}>
                            <span className={'text-white'}>{key}. {value as string}</span>
                          </Button>
                        )
                      }) :
                      <TextField
                        id="outlined-multiline-static"
                        className={'mt-2 mb-2'}
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
                sx={{
                  marginTop: '12px',
                  '& .Mui-selected': {
                    color: 'black !important',
                  },
                }}
                localeText={{footerRowSelected: (count) =>
                    count !== 1 ? `检查了 ${count.toLocaleString()} 道题` : `检查了 ${count.toLocaleString()} 道题`,}}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>取消</Button>
              <Button className={`text-white bg-[#c9aa62] hover:bg-[#c9aa62bb]`} onClick={preSubmit} autoFocus>
                提交
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={submitOpen} onClose={() => setSubmitOpen(false)}>
            <DialogTitle>{submitMessage}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setSubmitOpen(false)}>取消</Button>
              <Button className={`text-white bg-[#c9aa62] hover:bg-[#c9aa62bb]`} onClick={handleSubmit} autoFocus>
                提交
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={tipsOpen} onClose={() => setTipsOpen(false)}>
            <DialogTitle>{tipsMessage}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setTipsOpen(false)}>确认</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </div>
  )
}