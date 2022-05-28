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
  ranking?: number[]
  id?: number
  time?: number
  err?: string
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  try {
    const id = Number(context.query.id as string)
    const time = Number(context.query.time as string)
    if(Number.isNaN(time))throw new Error("error")
    //API call
    const ranking = await Array(5).fill(100)
    const props: Props = { ranking, id, time }
    return {
      props
    }
  } catch {
    return {
      props: { err: "error" }
    }
  }

}

const Result: NextPage<Props> = (props) => {
  console.log(props.time)
  if (props.err) {
    return <DefaultErrorPage statusCode={404} />
  }
  else {
    return (
      <>
        <Head>
          <title>result {props.id}</title>
        </Head>
        <Layout>
          <h1>RESULT STAGE {props.id}</h1>
          <div>
            <p>Your time is {props.time}!</p>
          </div>
          <div >
            <p>ranking</p>
            <ul>
              {props.ranking.map((ele, index) => (
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