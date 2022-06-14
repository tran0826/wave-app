import { NextPage } from "next"
import { useCallback, useRef, useState } from "react"
import Adsense from "../components/adsense"
import Layout from "../components/layout"
import SketchComponent from "../components/sketch"
import WaveSound from "../components/wave_sound"

const Free: NextPage = () => {
  const [userCoefficient, setUserCoefficient] = useState(
    Array(70).fill(0) as number[],
  )
  const [theta, setTheta] = useState(0)
  const intervalRef = useRef<NodeJS.Timer | null>(null)
  const moveWave = useCallback(() => {
    if (intervalRef.current !== null) {
      return
    }
    intervalRef.current = setInterval(() => {
      setTheta((theta) => theta + 2)
    }, 10)
  }, [])
  const stopWave = useCallback(() => {
    if (intervalRef.current === null) {
      return
    }
    clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])
  const resetWave = useCallback(() => {
    let nxtCoefficient = userCoefficient.map((value, idx) => {
      let ret: number = 0
      let htmlEle = document.getElementById("co" + idx) as HTMLInputElement
      htmlEle.value = String(ret)
      return ret
    })
    setUserCoefficient(nxtCoefficient)
  }, [])

  const setSawtoothWave = useCallback(() => {
    let nxtCoefficient = userCoefficient.map((value, idx) => {
      let ret: number
      if (idx % 2 == 0) ret = 1 / (idx + 1)
      else ret = -1 / (idx + 1)
      ret = Math.round(ret * 1000) / 1000
      let htmlEle = document.getElementById("co" + idx) as HTMLInputElement
      htmlEle.value = String(ret)
      return ret
    })
    setUserCoefficient(nxtCoefficient)
  }, [])
  const setSquareWave = useCallback(() => {
    let nxtCoefficient = userCoefficient.map((value, idx) => {
      let ret: number
      if (idx % 2 == 0) ret = 1 / (idx + 1)
      else ret = 0
      ret = Math.round(ret * 1000) / 1000
      let htmlEle = document.getElementById("co" + idx) as HTMLInputElement
      htmlEle.value = String(ret)
      return ret
    })
    setUserCoefficient(nxtCoefficient)
  }, [])

  return (
    <Layout>
      <section className="flex flex-col items-center">
        <h1 className="pt-2 mb-8 font-bold text-black sm:text-5xl md:mb-12 md:text-5xl">
          SIMULATOR
        </h1>
        <div className="items-center w-4/5 text-center">
          <div className="flex flex-row items-center">
            <div className="basis-2/5">
              <WaveSound coefficient={userCoefficient} />
            </div>
            <div className="basis-1/5"></div>
            <div className="inline-flex basis-2/5 justify-end rounded-md">
              <button
                className="focus:z-10 p-2 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-l-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                onClick={moveWave}
              >
                move
              </button>
              <button
                className="focus:z-10 p-2 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-r-md border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
                onClick={stopWave}
              >
                stop
              </button>
            </div>
          </div>
          <SketchComponent
            xPerPixel={0.01}
            userCoefficient={userCoefficient}
            theta={theta}
          />
          <div className="inline-flex shadow-sm">
            <button
              className="focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-l-lg border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
              onClick={resetWave}
            >
              reset wave
            </button>
            <button
              className="focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-y border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
              onClick={setSawtoothWave}
            >
              set sawtooth wave
            </button>
            <button
              className="focus:z-10 py-2 px-4 text-sm font-medium text-gray-900 hover:text-blue-700 focus:text-blue-700 dark:text-white dark:hover:text-white dark:focus:text-white bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-r-md border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-700 dark:focus:ring-blue-500"
              onClick={setSquareWave}
            >
              set square wave
            </button>
          </div>
          <div className="overflow-y-scroll h-32">
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
                      step="0.001"
                      id={"co" + id}
                      value={userCoefficient[id]}
                      onChange={() => {
                        let htmlEle = document.getElementById(
                          "co" + id,
                        ) as HTMLInputElement
                        let value: number = htmlEle.valueAsNumber
                        let nxtCoefficient = userCoefficient.map((ele, index) =>
                          index == id ? value : ele,
                        )
                        setUserCoefficient(nxtCoefficient)
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
      </section>
    </Layout>
  )
}

export default Free
