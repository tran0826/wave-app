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
  const waveSimilarity = useRef<number>(0)
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
      if (waveSimilarity.current > 10) {
        setNowTime(Date.now())
      }
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
      <section className="flex flex-col items-center text-center">
        <h1 className="pt-2 mb-8 font-bold text-black sm:text-5xl md:mb-6 md:text-5xl">
          STAGE {stageData.id}
        </h1>

        {startFlag ? (
          <div className="w-4/5">
            {waveSimilarity.current <= 10 ? (
              <div className="h-8">
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
                  <a className="inline-block py-2 px-3 text-sm font-bold text-center text-red-500 bg-gray-200 hover:bg-gray-300 rounded-lg outline-none focus-visible:ring ring-indigo-300 transition duration-100 md:text-base">
                    Show Result!
                  </a>
                </Link>
              </div>
            ) : (
              <div className="h-8">
                <p className="text-center sm:text-2xl">
                  reduce the similarity to less than 10
                </p>
              </div>
            )}
            <div className="flex flex-row items-center">
              <div className="basis-2/5">
                <WaveSound coefficient={userCoefficient} />
              </div>
              <span className="basis-1/5 text-sm sm:text-xl">
                {(Math.round((nowTime - startTime) / 100) / 10).toFixed(1)} sec
              </span>
              <div className="inline-flex basis-2/5 justify-end rounded-md">
                <button
                  className="focus:z-10 p-1 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-l-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                  onClick={moveWave}
                >
                  move
                </button>
                <button
                  className="focus:z-10 p-1 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-r-md border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                  onClick={stopWave}
                >
                  stop
                </button>
              </div>
            </div>
            <SketchComponent
              answerCoefficient={answerCoefficient}
              userCoefficient={userCoefficient}
              theta={theta}
            />
            <div className="flex flex-row text-center">
              <div className="basis-1/2 mb-4 font-semibold text-right text-black md:mb-6 md:text-lg xl:text-xl">
                similarity:
              </div>
              <div className="basis-1/2 justify-start mb-4 font-bold text-left text-red-500 md:mb-6 md:text-lg xl:text-xl">
                {waveSimilarity.current.toFixed(3)}
              </div>
            </div>

            <div className="overflow-y-auto h-32">
              <ul>
                {userCoefficient.map((num, id) => (
                  <li key={id} className="flex flex-row">
                    <div className="basis-2/12 pr-2 text-right">
                      a<sub>{id + 1}</sub>
                    </div>
                    <div className="basis-8/12">
                      <input
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        id={"co" + id}
                        value={userCoefficient[id]}
                        onChange={() => {
                          let htmlEle = document.getElementById(
                            "co" + id,
                          ) as HTMLInputElement
                          let value: number = htmlEle.valueAsNumber
                          let nxtCoefficient = userCoefficient.map(
                            (ele, index) => (index == id ? value : ele),
                          )
                          setUserCoefficient(nxtCoefficient)
                          waveSimilarity.current = calcWaveSimilarity(
                            nxtCoefficient,
                            answerCoefficient,
                          )
                        }}
                      ></input>
                    </div>
                    <div className="basis-2/12 pl-2 text-left">
                      {num.toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="items-center text-center">
            <p className="pb-2">
              Input your name, or your score will not be saved.
            </p>
            <input
              type="text"
              id="userNameBox"
              className="block p-2.5 w-full text-sm text-gray-900 dark:placeholder:text-gray-400 dark:text-white bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500"
              placeholder=""
              maxLength={15}
            />
            <button
              className="py-2 px-4 font-bold text-white bg-blue-500 hover:bg-blue-700 rounded"
              onClick={() => {
                setStartFlag(true)
                setNowTime(Date.now())
                setStartTime(Date.now())
                waveSimilarity.current = calcWaveSimilarity(
                  userCoefficient,
                  answerCoefficient,
                )
                let htmlEle = document.getElementById(
                  "userNameBox",
                ) as HTMLInputElement
                let value: string = htmlEle.value
                if (value !== "") setUserName(value)
              }}
            >
              Game Start!
            </button>
          </div>
        )}
      </section>
    </Layout>
  )
}

export default Stage
