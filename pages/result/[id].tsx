import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Layout from "../../components/layout"
import DefaultErrorPage from 'next/error'
import { LineIcon, LineShareButton, TwitterIcon, TwitterShareButton } from "react-share"


type Props = {
  data?: {
    ranking: {
      name: string
      time: number
    }[]
    id: number
    time: number
    userName: string
  }
  err?: string
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  try {
    const id = Number(context.query.id as string)
    const time = Number(context.query.time as string)
    if (Number.isNaN(time)) throw new Error("Result Time is invalid")
    const userName = context.query.userName
    if (typeof userName !== "string") throw new Error("userName is invalid")
    //API call
    const ranking = await Array(5).fill({ name: "aaa", time: "10" })
    return {
      props: { data: { ranking, id, time, userName } }
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: { err: err.message }
      }
    }
    throw err
  }
}

const Result: NextPage<Props> = ({ data, err }: Props) => {
  if (err || !data) {
    return <DefaultErrorPage statusCode={404} />
  }
  else {
    return (
      <Layout>
        <Head>
          <title>result stage {data.id}</title>
        </Head>
        <h1>RESULT STAGE {data.id}</h1>
        <div>
          <p>{data.userName + "'s"} time is {data.time} sec!</p>
        </div>
        <div>
          <TwitterShareButton url="https://wave-app-nine.vercel.app/" title={data.userName + "'s time is " + data.time + " sec on stage " + data.id + "! #wave_composite_game" }>
            <TwitterIcon size={30} round={false} />
          </TwitterShareButton>
          <LineShareButton url="https://wave-app-nine.vercel.app/" title={data.userName + "'s time is " + data.time + " sec on stage " + data.id + "! #wave_composite_game" }>
            <LineIcon size={30} round={false} />
          </LineShareButton>
        </div>
        <div >
          <p>ranking</p>
          <ol>
            {data.ranking.map((ele, index) => (
              <li key={index}>
                <p>{ele.name}:{ele.time}</p>
              </li>
            ))}
          </ol>
        </div>
      </Layout>
    )
  }
}

export default Result