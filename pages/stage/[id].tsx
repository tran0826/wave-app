import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, GetStaticPaths, NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import Layout from "../../components/layout"
import SketchComponent from "../../components/sketch"
import { getWaveCoefficient } from "../../lib/wave"


/*todo
Change SSG and Coefficient is need one more set in useState.
getStaticPaths is needed.
SSR is used for Title.
*/


type Props = {
    coefficient: number[]
    id: number
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const id = Number(context.query.id as string)
    const coefficient = await getWaveCoefficient(id)
    const props: Props = { coefficient, id }

    return {
        props
    }
}

const Stage: NextPage<Props> = (props) => {
    const [coefficient, setCoefficient] = useState(Array(props.id).fill(0))
    const [theta, setTheta] = useState(0)
    const [time,setTime] = useState({time:0})

    return (
        <>
            <Head>
                <title>stage {props.id}</title>
            </Head>
            <Layout>
                <h1>STAGE {props.id}</h1>
                <div>
                    <SketchComponent coefficient={[props.coefficient,coefficient]} theta={theta} />
                </div>
                <div >
                    <ul>
                        {
                            coefficient.map((num, id) => (
                                <li key={id}>
                                    {"co" + id}
                                    <input type="range" min="-1" max="1" step="0.01" id={"co" + id} onChange={() => {
                                        let htmlEle = document.getElementById("co" + id) as HTMLInputElement
                                        let value: number = htmlEle.valueAsNumber
                                        setCoefficient(coefficient.map((ele, index) => (index == id ? value : ele)))
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
                <div>
                    <Link
                    as={`/result/${props.id}`}
                    href={{pathname: `/result/${props.id}`, query:time}}
                    >
                        <a>OK!</a>
                    </Link>
                </div>
            </Layout>
        </>

    )
}

export default Stage