import type { NextPage, GetStaticProps } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'
import { LineIcon, LineShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import { Stage } from '../lib/stage'

type Props = {
  stages: Stage[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  //call api
  const api_base_url = process.env.API_BASE_URL
  const url = api_base_url + "/stage";
  const stages = await fetch(url).then((r) => r.json()) as Stage[]
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
          <Link href="/free">
            <a className={utilStyles.headingMd}>Free Mode</a>
          </Link>
          <ul className={utilStyles.headingMd}>
            {
              stages.map((stage, id) => (
                <li key={id}>
                  <Link href={`/stage/${stage.id}`}>
                    <a>Stage {stage.id}</a>
                  </Link>
                </li>
              ))
            }
          </ul>
          <ul className={utilStyles.headingMd}>
          {
            stages.map((stage, id) => (
              <li key={id}>
                <Link href={`/ranking/${stage.id}`}>
                  <a>Ranking Stage {stage.id}</a>
                </Link>
              </li>
            ))
          }
          </ul>
        </div>
      </section>
      <TwitterShareButton url="https://wave-app-nine.vercel.app/" title="Let's Play Wave composite game!">
        <TwitterIcon size={30} round={false} />
      </TwitterShareButton>
      <LineShareButton url="https://wave-app-nine.vercel.app/" title="Let's Play Wave composite game!">
        <LineIcon size={30} round={false} />
      </LineShareButton>
    </Layout>
  )
}

export default Home
