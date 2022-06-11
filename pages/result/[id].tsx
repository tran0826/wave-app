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
        <h1>RESULT STAGE {data.stageId}</h1>
        <div>
          <p>
            {data.userName + "'s"} time is {data.clearTime} sec!
          </p>
        </div>
        <div>
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

export default Result
