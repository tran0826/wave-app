import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import Layout from "../../components/layout"
import SketchComponent from "../../components/sketch"
import WaveSound from "../../components/wave_sound"
import { Stage as StageData } from "../../lib/stage"
import { calcWaveSimilarity, getWaveCoefficient } from "../../lib/wave"

type Props = {
  stageData: StageData
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (params) {
    const stageId = Number(params.id as string)
    const api_base_url = process.env.API_BASE_URL
    const url = api_base_url + "/stage"
    const stages = (await fetch(url).then((r) => r.json())) as StageData[]
    const stageData = stages[stageId - 1]
    return {
      props: {
        stageData,
      },
    }
  } else {
    throw new Error("no id")
  }
}
export const getStaticPaths: GetStaticPaths = async () => {
  const api_base_url = process.env.API_BASE_URL
  const url = api_base_url + "/stage"
  const stages = (await fetch(url).then((r) => r.json())) as StageData[]
  return {
    paths: stages.map((stage) => "/stage/" + stage.id),
    fallback: false,
  }
}

const Stage: NextPage<Props> = ({ stageData }) => {
  const [answerCoefficient, setAnswerCoefficient] = useState(
    Array(stageData.difficulty).fill(0) as number[],
  )
  const [userCoefficient, setUserCoefficient] = useState(
    Array(stageData.difficulty).fill(0) as number[],
  )
  const [waveSimilarity, setWaveSimilarity] = useState(0)
  const [theta, setTheta] = useState(0)
  const [startFlag, setStartFlag] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [nowTime, setNowTime] = useState(0)
  const [userName, setUserName] = useState("nanashi")

  //when game start
  useEffect(() => {
    console.log("useEffect")
    setAnswerCoefficient(getWaveCoefficient(stageData.difficulty))
    const interval = setInterval(() => {
      setNowTime(Date.now())
    }, 100)
    return () => clearInterval(interval)
  }, [stageData.difficulty])

  const intervalRef = useRef<NodeJS.Timer | null>(null)
  const moveWave = useCallback(() => {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      setTheta((theta) => theta + 1)
    }, 10)
  }, [])
  const stopWave = useCallback(() => {
    if (intervalRef.current === null) {
      return
    }
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  return (
    <Layout>
      <Head>
        <title>stage {stageData.id}</title>
      </Head>
      <h1>STAGE {stageData.id}</h1>

      {startFlag ? (
        <div>
          <WaveSound coefficient={userCoefficient} />
          <SketchComponent
            answerCoefficient={answerCoefficient}
            userCoefficient={userCoefficient}
            theta={theta}
          />
          <p>similarity: {waveSimilarity}</p>
          <p>{Math.round((nowTime - startTime) / 100) / 10} sec</p>

          <div>
            <button onClick={moveWave}>start move</button>
            <button onClick={stopWave}>stop move</button>
          </div>
          <div>
            <ul>
              {userCoefficient.map((num, id) => (
                <li key={id}>
                  {"co" + (id + 1)}
                  <input
                    className=""
                    type="range"
                    min="-1"
                    max="1"
                    step="0.01"
                    id={"co" + id}
                    onChange={() => {
                      let htmlEle = document.getElementById(
                        "co" + id,
                      ) as HTMLInputElement
                      let value: number = htmlEle.valueAsNumber
                      let nxtCoefficient = userCoefficient.map((ele, index) =>
                        index == id ? value : ele,
                      )
                      setUserCoefficient(nxtCoefficient)
                      setWaveSimilarity(
                        calcWaveSimilarity(nxtCoefficient, answerCoefficient),
                      )
                    }}
                  ></input>
                  {"value:" + num}
                </li>
              ))}
            </ul>
          </div>
          {waveSimilarity <= 10 ? (
            <div>
              <Link
                as={`/result/${stageData.id}`}
                href={{
                  pathname: `/result/${stageData.id}`,
                  query: {
                    time: Math.round((nowTime - startTime) / 100) / 10,
                    userName: userName,
                    uuid: uuidv4(),
                  },
                }}
              >
                <a>CLEAR!</a>
              </Link>
            </div>
          ) : (
            <div>
              <p>Wrong answer, reduce the similarity to less than 10 </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>input your name</p>
          <input type="text" id="userNameBox" />
          <button
            onClick={() => {
              setStartFlag(true)
              setNowTime(Date.now())
              setStartTime(Date.now())
              setWaveSimilarity(
                calcWaveSimilarity(userCoefficient, answerCoefficient),
              )
              let htmlEle = document.getElementById(
                "userNameBox",
              ) as HTMLInputElement
              let value: string = htmlEle.value
              if (value !== "") setUserName(value)
            }}
          >
            Start!
          </button>
        </div>
      )}
    </Layout>
  )
}

export default Stage
