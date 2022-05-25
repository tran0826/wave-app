import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SketchComponent from '../components/sketch'
import Layout from '../components/layout'
import Link from 'next/link'
import { useState } from 'react'
import utilStyles from '../styles/utils.module.css'

//call API to get stage
const stages: number[] = [1, 2, 3, 4, 5]

const Home: NextPage = () => {
  const [coefficient, setCoefficient] = useState(Array(10).fill(0))
  const [theta, setTheta] = useState(0)

  return (
    <Layout home>
      <section>
        <div>
          <ul className={utilStyles.headingMd}>
            {
              stages.map((num, id) => (
                <li key={id}>
                  <Link href={`/stage/${num}`}>
                    <a>Stage {num}</a>
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </section>
    </Layout>
  )
}

export default Home
