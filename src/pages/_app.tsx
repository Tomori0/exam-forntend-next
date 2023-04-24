import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {createTheme, ThemeProvider} from "@mui/material";
import Head from "next/head";
import Footer from "../../components/footer";
import Header from "../../components/header";

const theme = createTheme({
  palette: {
    primary: {
      // light: 这将从 palette.primary.main 中进行计算，
      light: '#a6d4fa',
      main: '#90caf9',
      // main: '#c9aa62',
      dark: '#648dae'
      // dark: 这将从 palette.primary.main 中进行计算，
      // contrastText: 这将计算与 palette.primary.main 的对比度
    },
    error: {
      main: '#d32f2f',
    }
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>玖义考试</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='description' content='上海玖义科技有限公司考试练习系统' />
        <meta name='keywords' content='上海玖义科技有限公司,玖义科技,玖义考试,玖义练习,考试,练习,玖义' />
        <link rel='icon' href='/images/favicon.ico' />
      </Head>
      <Header></Header>
      <div className='h-screen bg-gradient-to-r to-[#c9aa62bb] from-[#c7c7c7bb]'>
        <Component {...pageProps} />
      </div>
      <Footer/>
    </ThemeProvider>
  )
}
