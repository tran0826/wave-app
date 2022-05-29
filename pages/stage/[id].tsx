import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import Layout from "../../components/layout"
import SketchComponent from "../../components/sketch"
import { calcWaveSimilarity, getWaveCoefficient } from "../../lib/wave"



type Props = {
    id: number
}



export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    if (params) {
        const id = Number(params.id as string)
        return {
            props: {
                id
            }
        }
    } else {
        throw new Error("no id")
    }
}
export const getStaticPaths: GetStaticPaths = async () => {
    const stages = [1, 2, 3, 4, 5, 6]
    return {
        paths: stages.map((e) => ("/stage/" + e)),
        fallback: false
    }
}

const Stage: NextPage<Props> = (props) => {
    const [answerCoefficient, setAnswerCoefficient] = useState(Array(props.id).fill(0) as number[])
    const [userCoefficient, setUserCoefficient] = useState(Array(props.id).fill(0) as number[])
    const [waveSimilarity, setWaveSimilarity] = useState(0)
    const [theta, setTheta] = useState(0)
    const [startFlag, setStartFlag] = useState(false)
    const [startTime, setStartTime] = useState(0)
    const [nowTime, setNowTime] = useState(0)
    const [userName, setUserName] = useState("nanashi")

    //when game start
    useEffect(() => {
        console.log("useEffect")
        setAnswerCoefficient(getWaveCoefficient(props.id))
        const interval = setInterval(() => {
            setNowTime(Date.now())
        }, 100)
        return () => clearInterval(interval)
    }, [props.id])

    const intervalRef = useRef<NodeJS.Timer | null>(null)
    const moveWave = useCallback(() => {
        if (intervalRef.current !== null) {
            return
        }
        intervalRef.current = setInterval(() => {
            setTheta(theta => theta + 1)
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
                <title>stage {props.id}</title>
            </Head>
            <h1>STAGE {props.id}</h1>

            {startFlag ?
                <div>
                    <SketchComponent coefficient={[answerCoefficient, userCoefficient]} theta={theta} />
                    <p>similarity: {waveSimilarity}</p>
                    <p>{Math.round((nowTime - startTime) / 100) / 10} sec</p>

                    <div>
                        <button onClick={moveWave}>start move</button>
                        <button onClick={stopWave}>stop move</button>
                    </div>
                    <div >
                        <ul>
                            {
                                userCoefficient.map((num, id) => (
                                    <li key={id}>
                                        {"co" + id}
                                        <input type="range" min="-1" max="1" step="0.01" id={"co" + id} onChange={() => {
                                            let htmlEle = document.getElementById("co" + id) as HTMLInputElement
                                            let value: number = htmlEle.valueAsNumber
                                            setUserCoefficient(userCoefficient.map((ele, index) => (index == id ? value : ele)))
                                            setWaveSimilarity(calcWaveSimilarity(userCoefficient, answerCoefficient))
                                        }}></input>
                                        {"value:" + num}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    {
                        waveSimilarity < 10 ?
                            <div>
                                <Link
                                    as={`/result/${props.id}`}
                                    href={
                                        {
                                            pathname: `/result/${props.id}`,
                                            query: {
                                                time: Math.round((nowTime - startTime) / 100) / 10,
                                                userName: userName
                                            }
                                        }}
                                >
                                    <a>CLEAR!</a>
                                </Link>
                            </div>
                            :
                            <div>
                                <p>Wrong answer </p>
                            </div>
                    }
                </div>
                :
                <div>
                    <p>input your name</p>
                    <input type="text" id="userNameBox" />
                    <button onClick={() => {
                        setStartFlag(true)
                        setNowTime(Date.now())
                        setStartTime(Date.now())
                        setWaveSimilarity(calcWaveSimilarity(userCoefficient, answerCoefficient))
                        let htmlEle = document.getElementById("userNameBox") as HTMLInputElement
                        let value: string = htmlEle.value
                        if (value !== "") setUserName(value)
                    }}>Start!</button>
                </div>
            }



        </Layout>
    )
}

export default Stage