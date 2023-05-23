import {Card, CardContent} from '@mui/material';
import React, {useEffect, useState} from "react";
import {unified} from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";

interface ChatModal {
  content: string
}
export default function Chat({content}: ChatModal) {

  const [md, setMd] = useState('')

  useEffect(() => {
    const convertContent = async () => {
      const markdown = await unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(content)
      setMd(String(markdown))
    }
    convertContent()
  }, [])


  return (
    <Card sx={{maxWidth: '80%'}}>
      <CardContent>
        <div dangerouslySetInnerHTML = {{ __html: md }}></div>
      </CardContent>
    </Card>
  )
}
