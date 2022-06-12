import { GetServerSideProps, NextPage } from "next"
import DefaultErrorPage from "next/error"
import Head from "next/head"
import {
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"
import Layout from "../../components/layout"
import RankingList from "../../components/ranking"
import { Score, PostScore } from "../../lib/score"

type Props = {
  data?: {
    scores: Score[]
    stageId: number
    clearTime: number
    userName: string
  }
  err?: string
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  try {
    const stageId = Number(context.query.id as string)
    const clearTime = Number(context.query.time as string)
    const uuid = context.query.uuid as string
    if (Number.isNaN(clearTime)) throw new Error("Result Time is invalid")
    const userName = context.query.userName
    if (typeof userName !== "string") throw new Error("userName is invalid")
    //API call
    const api_base_url = process.env.API_BASE_URL
    const post_score_url = api_base_url + "/score"
    const post_score: PostScore = {
      uuid,
      stage_id: stageId,
      clear_time: clearTime,
      user_name: userName,
    }
    await fetch(post_score_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post_score),
    })
    const get_score_url = api_base_url + "/score/" + stageId
    const response = await fetch(get_score_url)
    //    if (!response.ok) throw new Error("failed get result")
    const scores = (await response.json()) as Score[]
    return {
      props: { data: { scores, stageId, clearTime, userName } },
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

const Result: NextPage<Props> = ({ data, err }: Props) => {
  if (err || !data) {
    return <DefaultErrorPage statusCode={404} />
  } else {
    return (
      <Layout>
        <Head>
          <title>result stage {data.stageId}</title>
        </Head>
        <section className="flex flex-col items-center">
          <div className="flex flex-col items-center max-w-xl text-center">
            <h1 className="pt-16 mb-8 font-bold text-black sm:text-5xl md:mb-32 md:text-5xl">
              RESULT STAGE {data.stageId}
            </h1>
            <p className="mb-4 text-4xl font-bold text-blue-700 md:mb-4">
              {data.userName + "'s"} time is {data.clearTime} sec!
            </p>
            <p className="mb-4 text-xl text-black md:mb-4">share your time</p>
          </div>
          <div className="mb-12 md:mb-12">
            <TwitterShareButton
              url="https://wave-app-nine.vercel.app/"
              title={
                data.userName +
                "'s time is " +
                data.clearTime +
                " sec on stage " +
                data.stageId +
                "! #wave_composite_game"
              }
            >
              <TwitterIcon size={30} round={false} />
            </TwitterShareButton>
            <LineShareButton
              url="https://wave-app-nine.vercel.app/"
              title={
                data.userName +
                "'s time is " +
                data.clearTime +
                " sec on stage " +
                data.stageId +
                "! #wave_composite_game"
              }
            >
              <LineIcon size={30} round={false} />
            </LineShareButton>
          </div>
          <h2 className="mb-6 text-4xl font-bold text-black md:mb-6">
            RANKING
          </h2>
          <RankingList data={data} />
        </section>
      </Layout>
    )
  }
}

export default Result
