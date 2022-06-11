import { GetServerSideProps, NextPage } from "next"
import DefaultErrorPage from "next/error"
import Head from "next/head"
import Layout from "../../components/layout"
import { Score } from "../../lib/score"

type Props = {
  data?: {
    scores: Score[]
    stageId: number
  }
  err?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  try {
    const stageId = Number(context.query.id as string)
    //API call
    const api_base_url = process.env.API_BASE_URL
    const get_score_url = api_base_url + "/score/" + stageId
    const response = await fetch(get_score_url)
    if (!response.ok) throw new Error("failed get result")
    const scores = (await response.json()) as Score[]
    return {
      props: { data: { scores, stageId } },
    }
  } catch (err) {
    if (err instanceof Error) {
      return {
        props: { err: err.message },
      }
    }
    throw err
  }
}

const Ranking: NextPage<Props> = ({ data, err }: Props) => {
  if (err || !data) {
    return <DefaultErrorPage statusCode={404} />
  } else {
    return (
      <Layout>
        <Head>
          <title>ranking stage {data.stageId}</title>
        </Head>
        <h1>STAGE {data.stageId}</h1>
        <div>
          <p>ranking</p>
          <ol>
            {data.scores.map((score, index) => (
              <li key={index}>
                <p>
                  {score.user_name}:{score.clear_time}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Layout>
    )
  }
}

export default Ranking
