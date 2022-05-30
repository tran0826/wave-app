import { GetStaticProps } from "next";
import Layout from "../components/layout";

type Props = {stars:number}

export const getStaticProps:GetStaticProps<Props> = async () => {
    const url = "https://api.github.com/repos/zeit/next.js";
    const json = await fetch(url).then((r) => r.json())
    const stars = json.stargazers_count
    return {
        props:{
            stars
        }
    }
}

export default function page2({stars}:Props) {
    return (
        <Layout>
           <div>{stars}</div>
        </Layout>
    )
}