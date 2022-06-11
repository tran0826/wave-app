import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"

const BASE_FREQ = 220

const WaveSound = ({ coefficient }: { coefficient: number[] }) => {
  const audioContext = useRef<AudioContext | null>(null)
  const oscNodes = useRef<OscillatorNode[] | null>(null)
  const gainNodes = useRef<GainNode[] | null>(null)
  const masterGainNode = useRef<GainNode | null>(null)
  const [isPlaySound, setIsPlaySound] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!gainNodes.current) {
      audioContext.current = new AudioContext()
      oscNodes.current = coefficient.map((value, idx) => {
        let ret = new OscillatorNode(audioContext.current as AudioContext)
        ret.frequency.value = BASE_FREQ * (idx + 1)
        ret.type = "sine"
        return ret
      })
      gainNodes.current = coefficient.map((value, idx) => {
        let ret = (audioContext.current as AudioContext).createGain()
        ret.gain.value = value
        return ret
      })
      masterGainNode.current = audioContext.current.createGain()
      masterGainNode.current.gain.value = 0.5
      for (let i = 0; i < oscNodes.current.length; i++) {
        oscNodes.current[i].connect(gainNodes.current[i])
        gainNodes.current[i].connect(masterGainNode.current)
      }
      masterGainNode.current.connect(audioContext.current.destination)
    } else {
      for (let i = 0; i < gainNodes.current.length; i++) {
        gainNodes.current[i].gain.value = coefficient[i]
      }
    }
  }, [coefficient, isPlaySound])

  const soundStart = useCallback(() => {
    if (audioContext.current && audioContext.current.state === "suspended") {
      audioContext.current.resume()
    }
    if (oscNodes.current && !isPlaySound) {
      let htmlEle = document.getElementById("gain") as HTMLInputElement
      let value: number = htmlEle.valueAsNumber
      if (masterGainNode.current) masterGainNode.current.gain.value = value
      oscNodes.current.forEach((e) => {
        e.start(0)
      })
      setIsPlaySound(true)
    }
  }, [isPlaySound])

  const soundStop = useCallback(() => {
    if (oscNodes.current && isPlaySound) {
      oscNodes.current.forEach((e) => {
        e.stop()
      })
      audioContext.current = null
      oscNodes.current = null
      gainNodes.current = null
      masterGainNode.current = null
      setIsPlaySound(false)
    }
  }, [isPlaySound])

  useEffect(() => {
    router.events.on("routeChangeStart", soundStop)
    return () => {
      router.events.off("routeChangeStart", soundStop)
    }
  })

  return (
    <div>
      <div>
        {isPlaySound ? (
          <button type="button" onClick={soundStop}>
            sound stop
          </button>
        ) : (
          <button type="button" onClick={soundStart}>
            sound start
          </button>
        )}
      </div>
      <div>
        gain
        <input
          type="range"
          min="0"
          max="0.1"
          step="0.002"
          id="gain"
          onChange={() => {
            let htmlEle = document.getElementById("gain") as HTMLInputElement
            let value: number = htmlEle.valueAsNumber
            if (masterGainNode.current)
              masterGainNode.current.gain.value = value
          }}
        ></input>
      </div>
    </div>
  )
}

export default WaveSound
