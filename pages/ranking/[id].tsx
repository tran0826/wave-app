import { GetServerSideProps, NextPage } from "next"
import DefaultErrorPage from "next/error"
import Head from "next/head"
import Layout from "../../components/layout"
import RankingList from "../../components/ranking"
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
        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center py-12 max-w-xl text-center lg:py-12">
            <h1 className="mb-8 font-bold text-black sm:text-5xl md:mb-12 md:text-5xl">
              SCORE ATTACK RANKING
            </h1>
            <h2 className="mb-6 text-4xl font-bold text-black md:mb-6">
              STAGE {data.stageId}
            </h2>
          </div>
          <RankingList data={data} />
        </section>
      </Layout>
    )
  }
}

export default Ranking
