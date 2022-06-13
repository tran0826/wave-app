import { useRouter } from "next/router"
import React, { useEffect } from "react"

const Adsense = () => {
  const { asPath } = useRouter()

  useEffect(() => {
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.log(err)
    }
  }, [asPath])

  return (
    <div key={asPath}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="auto"
        data-ad-format="xxx"
        data-ad-client="xxx"
        data-ad-slot="xxx"
      />
    </div>
  )
}
export default Adsense
