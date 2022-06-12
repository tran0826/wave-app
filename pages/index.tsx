import type { NextPage, GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import {
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"
import Layout from "../components/layout"
import { Stage } from "../lib/stage"

type Props = {
  stages: Stage[]
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  //call api
  const api_base_url = process.env.API_BASE_URL
  const url = api_base_url + "/stage"
  const stages = (await fetch(url).then((r) => r.json())) as Stage[]
  return {
    props: {
      stages,
    },
  }
}

const Home: NextPage<Props> = ({ stages }) => {
  return (
    <Layout home>
      <Head>
        <title>wave composite game</title>
      </Head>
      <section className="flex flex-col items-center">
        <div className="flex flex-col items-center pt-8 pb-16 max-w-xl text-center lg:pt-32 lg:pb-48">
          <p className="mb-4 font-semibold text-indigo-500 md:mb-6 md:text-lg xl:text-xl">
            Interesting simulator
          </p>

          <h1 className="mb-8 text-4xl font-bold text-black sm:text-5xl md:mb-12 md:text-5xl">
            Wave Composite Game
          </h1>

          <div className="flex flex-col gap-2.5 w-6/12 sm:justify-center">
            <details className="text-red-500 active:text-red-700 bg-gray-200 hover:bg-gray-300 rounded-lg outline-none">
              <summary className="block py-3 text-sm font-semibold text-center outline-none focus-visible:ring ring-indigo-300 transition duration-100 md:text-base">
                <div>Game Mode</div>
              </summary>
              <ul className="">
                {stages.map((stage, id) => (
                  <li key={id}>
                    <Link href={`/stage/${stage.id}`}>
                      <a className="hover:text-indigo-500 active:text-indigo-600 transition duration-100">
                        Stage {stage.id}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
            <details className="text-gray-500 active:text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg outline-none">
              <summary className="block py-3 text-sm font-semibold text-center outline-none focus-visible:ring ring-indigo-300 transition duration-100 md:text-base">
                <div>Ranking</div>
              </summary>
              <ul className="">
                {stages.map((stage, id) => (
                  <li key={id}>
                    <Link href={`/ranking/${stage.id}`}>
                      <a className="hover:text-indigo-500 active:text-indigo-600 transition duration-100">
                        Ranking Stage {stage.id}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </details>

            <Link href="/free">
              <a className="inline-block py-3 text-sm font-semibold text-center text-white bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 rounded-lg outline-none focus-visible:ring ring-indigo-300 transition duration-100 md:text-base">
                Free Mode
              </a>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Home
