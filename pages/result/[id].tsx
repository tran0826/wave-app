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
    ranking: number[]
    id: number
    time: number
  }
  err?: string
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  try {
    const id = Number(context.query.id as string)
    const time = Number(context.query.time as string)
    if (Number.isNaN(time)) throw new Error("Result Time is invalid")
    //API call
    const ranking = await Array(5).fill(100)
    return {
      props:{data:{ ranking, id, time } }
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

const Result: NextPage<Props> = ({data,err}: Props) => {
  if (err || !data) {
    return <DefaultErrorPage statusCode={404} />
  }
  else{
    return (
      <>
        <Head>
          <title>result {data.id}</title>
        </Head>
        <Layout>
          <h1>RESULT STAGE {data.id}</h1>
          <div>
            <p>Your time is {data.time}!</p>
          </div>
          <div >
            <p>ranking</p>
            <ul>
              {data.ranking.map((ele, index) => (
                <li key={index}>
                  <p>{ele}</p>
                </li>
              ))}
            </ul>
          </div>
        </Layout>
      </>
    )
  }
}

export default Result