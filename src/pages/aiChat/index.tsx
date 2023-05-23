import Head from 'next/head';
import {Box, Container, InputAdornment, OutlinedInput, TextareaAutosize} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import React, {KeyboardEvent, useEffect, useState} from "react";
import Chat from "../../../components/Chat";
import useServiceAxios from "../../../util/useServiceAxios";
import {useRouter} from "next/router";
import ChatToken from "../../../interface/ChatToken";
import ChatResponse from "../../../interface/ChatResponse";

interface ChatModal {
  id: string
  role: string
  content: string
}

export default function AiChat() {

  const [inputValue, setInputValue] = useState<string>('')
  const [data, setData] = useState<ChatModal[]>([])
  const [chatToken, setChatToken] = useState<ChatToken>({token: '', chatId: ''})
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const response = await useServiceAxios<ChatToken, any>({
        url: '/api/ai/chat/getToken',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      }, router)
      if (response.status !== 200) {
        alert(response.statusText)
      } else {
        setChatToken(response.data)
      }
    }
    fetchData()
  }, [])

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      data.push({id: String(data.length + 1), role: 'user', content: inputValue})
      setInputValue('')
      const response = await useServiceAxios<ChatResponse, any>({
        url: '/api/ai/chat/completions',
        method: 'post',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        data: {
          chatId: chatToken.chatId,
          token: chatToken.token,
          chatMessages: data
        }
      }, router)
      if (response.status !== 200) {

      } else {
        setData(prevData => [...prevData, {id: String(data.length + 1), role: response.data.role, content: response.data.content}])
      }
    } else {
      return event
    }
  }

  return (
    <div>
      <Head><title>AI解惑 - 玖义考试</title></Head>
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          margin: '0 auto'
        }}
      >
        <Container>
          <div className="relative h-[calc(100vh-64px)] flex flex-col">
            <div className="flex-grow mt-2 overflow-auto">
              {data.map((value) => {
                return (
                  <div className={`flex ${value.role === 'user' ? 'flex-row-reverse' : 'flex-row'} mt-3`}>
                    <Chat content={value.content}/>
                  </div>
                )
              })}
            </div>
            <div className="mt-2 mb-4">
              <OutlinedInput
                fullWidth
                type={'text'}
                multiline
                minRows={1}
                inputComponent={TextareaAutosize}
                placeholder={'有什么问题尽管问我...'}
                inputProps={{maxLength: 4000}}
                onKeyDown={handleKeyDown}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                aria-describedby={'password-error-text'}
                startAdornment={
                  <InputAdornment position='start'>
                    <ChatIcon/>
                  </InputAdornment>
                }
              />
            </div>
          </div>
        </Container>
      </Box>
    </div>
  )
}
