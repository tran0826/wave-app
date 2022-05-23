import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SketchComponent from '../components/sketch'
import Layout from '../components/layout'
import Link from 'next/link'
import { useState } from 'react'
import utilStyles from '../styles/utils.module.css'



const Home: NextPage = () => {
  const [coefficient, setCoefficient] = useState(Array(10).fill(0))
  const [theta, setTheta] = useState(0)

  return (
    <Layout home>
      <section>
        <div>
          <SketchComponent coefficient={coefficient} theta={theta} />
        </div>
        <div >
          <ul>
            {
              coefficient.map((num,id) => (
                <li key={id}>
                  {"co" + id}
                  <input type="range" min="-1" max="1" step="0.01" id={"co"+id} onChange={() => {
                    let htmlEle = document.getElementById("co" + id) as HTMLInputElement
                    let value: number = htmlEle.valueAsNumber
                    setCoefficient(coefficient.map((ele,index) => (index == id ? value : ele)))
                  }}></input>
                  {"value:" + num}
                </li>
              ))
            }
          </ul>
        </div>
        <div>
          <button onClick={() => setTheta(theta + 1)}>next time {theta}</button>
        </div>
        <div className={utilStyles.headingMd}>
          <Link href='/page2'>Go page2</Link>
        </div>
      </section>
    </Layout>
  )
}

export default Home
