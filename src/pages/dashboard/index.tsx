import Head from 'next/head';
import {useEffect} from 'react';
import serviceAxios from '../../../util/serviceAxios';
import {AxiosResponse} from 'axios';
import {UserInfo} from '../../../interface/UserInfo';

export default function Dashboard() {

  useEffect(() => {
    serviceAxios({
      url: '/api/auth/info',
      method: 'get'
    }).then((response: AxiosResponse<UserInfo>) => {
      sessionStorage.setItem('user', JSON.stringify(response.data))
    }).catch(() => {
    })
  }, [])

  return (
    <div>
      <Head><title>首页 - 玖义考试</title></Head>
    </div>
  )
}
