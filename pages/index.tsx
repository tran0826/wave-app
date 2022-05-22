import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SketchComponent from '../components/sketch'
import Layout from '../components/layout'
import Link from 'next/link'
import { useState } from 'react'



const Home: NextPage = () => {
  const [coefficient, setCoefficient] = useState([1, 0, -1 / 9, 0, 1 / 25, 0, -1 / 49])
  const [theta, setTheta] = useState(0)

  return (
    <Layout home>
      <section>
        <div>
          <SketchComponent coefficient={coefficient} theta={theta} />
        </div>
        <div>
          <Link href='/test'>Go test</Link>
        </div>
        <div>
          <button onClick={() => setTheta(theta + 1)}>next time</button>
          <p>{theta}</p>
        </div>
        <div>
          <ol>
            <li>
              <input type="range" id="co1" onChange={() => {
                let value = document.getElementById("co1")!.value!
                setCoefficient(coefficient.map((ele, index) => (index === 0 ? value / 50 : ele)))
              }}></input>
            </li>
            <li>
            <input type="range" id="co2" onChange={() => {
                let value = document.getElementById("co2")!.value!
                setCoefficient(coefficient.map((ele, index) => (index === 1 ? value / 50 : ele)))
              }}></input>
            </li>
            <li>
            <input type="range" id="co3" onChange={() => {
                let value = document.getElementById("co3")!.value!
                setCoefficient(coefficient.map((ele, index) => (index === 2 ? value / 50 : ele)))
              }}></input>
            </li>
          </ol>

        </div>
      </section>
    </Layout>
  )
}

export default Home
