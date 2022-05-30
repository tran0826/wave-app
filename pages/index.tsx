import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SketchComponent from '../components/sketch'
import Layout from '../components/layout'
import Link from 'next/link'
import { useState } from 'react'
import utilStyles from '../styles/utils.module.css'

type Props = {
  stages: number[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  //call api
  const stages = [1, 2, 3, 4, 5, 6]
  return {
    props: {
      stages
    }
  }
}

const Home: NextPage<Props> = ({ stages }) => {

  return (
    <Layout home>
      <Head>
        <title>wave composite game</title>
      </Head>
      <section>
        <h1>Wave Composite Game</h1>
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
