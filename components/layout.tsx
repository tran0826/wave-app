import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import {
  LineIcon,
  LineShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share"

const name = "tran0826"
export const siteTitle = "Wave Composite Game"

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Wave Composite Game" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle,
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@tran0826" />
      </Head>
      <main>{children}</main>
      <div className="pt-4 bg-white sm:pt-10 lg:pt-12">
        <footer className="px-4 mx-auto max-w-screen-2xl md:px-8">
          <div className="flex flex-col gap-4 justify-between items-center py-6 border-y md:flex-row">
            <nav className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:gap-6 md:justify-start">
              <Link href="/">
                <a className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100">
                  Top
                </a>
              </Link>
              <Link href="/free">
                <a className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100">
                  Free
                </a>
              </Link>
              <Link href="#">
                <a className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100">
                  About
                </a>
              </Link>
              <a
                href="https://twitter.com/tran0826"
                className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact
              </a>
            </nav>

            <div className="flex gap-4">
              <TwitterShareButton
                url="https://wave-app-nine.vercel.app/"
                title="Let's Play Wave composite game!"
              >
                <TwitterIcon size={30} round={false} />
              </TwitterShareButton>
              <LineShareButton
                url="https://wave-app-nine.vercel.app/"
                title="Let's Play Wave composite game!"
              >
                <LineIcon size={30} round={false} />
              </LineShareButton>
            </div>
          </div>

          <div className="py-8 text-sm text-center text-gray-400">
            If you find a bug, please contact{" "}
            <a
              href="https://twitter.com/tran0826"
              className="text-gray-500 hover:text-indigo-500 active:text-indigo-600 transition duration-100"
              target="_blank"
              rel="noopener noreferrer"
            >
              @tran0826
            </a>
            .
          </div>
        </footer>
      </div>
    </div>
  )
}
