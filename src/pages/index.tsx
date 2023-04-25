import Image from 'next/image'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Configuration, OpenAIApi } from 'openai'
import { useState } from 'react'
import { start } from 'repl'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [message, setMessage] = useState('') // 自分が投稿したメッセージ
  const [messages, setMessages] = useState<{ sender: string; text: string | undefined }[]>([])
  const [isLoading, setIsLoading] = useState(false) // ローディングに関する状態

  // OpenAIのAPIキー
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAPI_KEY
  })

  // OpenAIの関数の有効化
  const openai = new OpenAIApi(configuration)

  const hendleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // APIを叩く
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }]
    })

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: message },
      { sender: 'ai', text: response.data.choices[0].message?.content }
    ])

    console.log(messages)
    // console.log(response.data.choices[0].message?.content)
    setIsLoading(false)
  }

  return (
    <>
      <Head>
        <title>ChatGPT Clone</title>
        <meta name="description" content="ChatGPTのCloneアプリです。" />
      </Head>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="max-w-lg w-full">
          <div style={{ height: '650px' }} className="bg-gray-100 w-full p-4 h-96 overflow-scroll rounded-lg">
            <span className="text-center block font-medium text-2xl border-b-2 border-indigo-400 pb-4 mb-3">
              ChatGPT Clone
            </span>
            {messages.map((message, index) => {
              return (
                <div
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}  mb-2`}
                  key={index}
                >
                  <div
                    className={`${
                      message.sender === 'user' ? 'bg-indigo-400 text-white' : 'bg-gray-200'
                    } p-2 rounded-md`}
                  >
                    {message.text}
                  </div>
                </div>
              )
            })}
          </div>
          <form className="w-full" onSubmit={(e) => hendleSubmit(e)}>
            <div className="flex items-center p-4 bg-gray-100 rounded-lg w-full">
              <input
                type="text"
                className="flex-1 border-2 py-2 px-4 focus:outline-none rounded-lg focus:border-indigo-400"
                onChange={(e) => setMessage(e.target.value)} // 入力した文字列をmessageに格納
                value={message}
              />
              <button type="submit" className="p-2 bg-indigo-400 rounded-lg text-white hover:bg-indigo-500">
                {isLoading ? '送信中' : '送信'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
