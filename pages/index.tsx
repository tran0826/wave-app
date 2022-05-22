import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SketchComponent from '../components/sketch'
import Layout from '../components/layout'
import Link from 'next/link'


const Home: NextPage = () => {
  return (
    <Layout home>
      <section>
        <div>
          <SketchComponent />
        </div>
        <div>
          <Link href='/test'>Go test</Link>
        </div>
      </section>
    </Layout>
  )
}

export default Home
