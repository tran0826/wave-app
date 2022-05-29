import { GetServerSideProps, NextPage } from "next"
import Head from "next/head"
import Layout from "../../components/layout"
import DefaultErrorPage from 'next/error'


/*todo
Change SSG and Coefficient is need one more set in useState.
getStaticPaths is needed.
SSR is used for Title.
*/


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
          <title>result {data.id}</title>
        </Head>
        <h1>RESULT STAGE {data.id}</h1>
        <div>
          <p>{data.userName + "'s"} time is {data.time}!</p>
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