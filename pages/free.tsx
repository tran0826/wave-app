import { NextPage } from "next";
import { useCallback, useRef, useState } from "react";
import Layout from "../components/layout";
import SketchComponent from "../components/sketch";
import WaveSound from "../components/wave_sound";
import utilStyles from '../styles/utils.module.css'

const Free: NextPage = () => {
  const [userCoefficient, setUserCoefficient] = useState(Array(70).fill(0) as number[])
  const [theta, setTheta] = useState(0)
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
  const resetWave = useCallback(() => {
    let nxtCoefficient = userCoefficient.map((value,idx)=>{
      let ret:number=0
      let htmlEle = document.getElementById("co" + idx) as HTMLInputElement
      htmlEle.value = String(ret)
      return ret
    })
    setUserCoefficient(nxtCoefficient)
  },[])

  const setSawtoothWave = useCallback(() => {
    let nxtCoefficient = userCoefficient.map((value,idx)=>{
      let ret:number
      if(idx % 2 == 0)ret = 1/(idx+1)
      else ret = -1/(idx+1)
      ret = Math.round(ret * 1000)/1000
      let htmlEle = document.getElementById("co" + idx) as HTMLInputElement
      htmlEle.value = String(ret)
      return ret
    })
    setUserCoefficient(nxtCoefficient)
  }, [])

  return (
    <Layout>
      <div>
        <WaveSound coefficient={userCoefficient} />
        <SketchComponent userCoefficient={userCoefficient} theta={theta} />
        <div>
          <button onClick={moveWave}>start move</button>
          <button onClick={stopWave}>stop move</button>
          <button onClick={resetWave}>reset wave</button>
          <button onClick={setSawtoothWave}>set sawtooth wave</button>
        </div>
        <div >
          <ul>
            {
              userCoefficient.map((num, id) => (
                <li key={id}>
                  {"co" + (id + 1)}
                  <input className={utilStyles.coefficient} type="range" min="-1" max="1" step="0.001" id={"co" + id} onChange={() => {
                    let htmlEle = document.getElementById("co" + id) as HTMLInputElement
                    let value: number = htmlEle.valueAsNumber
                    let nxtCoefficient = userCoefficient.map((ele, index) => (index == id ? value : ele))
                    setUserCoefficient(nxtCoefficient)
                  }}></input>
                  {"value:" + num}
                </li>
              ))
            }
          </ul>
        </div>

      </div>


    </Layout>
  )
}

export default Free