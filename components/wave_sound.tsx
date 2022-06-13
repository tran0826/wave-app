import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import { Activity, Volume, Volume1, Volume2, VolumeX } from "react-feather"

const WaveSound = ({ coefficient }: { coefficient: number[] }) => {
  const audioContext = useRef<AudioContext | null>(null)
  const oscNodes = useRef<OscillatorNode[] | null>(null)
  const gainNodes = useRef<GainNode[] | null>(null)
  const masterGainNode = useRef<GainNode | null>(null)
  const [isPlaySound, setIsPlaySound] = useState(false)
  const router = useRouter()
  const [baseFreq, setBaseFreq] = useState(220)
  const [gain, setGain] = useState(0)

  useEffect(() => {
    if (!gainNodes.current) {
      audioContext.current = new AudioContext()
      oscNodes.current = coefficient.map((value, idx) => {
        let ret = new OscillatorNode(audioContext.current as AudioContext)
        ret.frequency.value = baseFreq * (idx + 1)
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
    <div className="flex flex-col py-1">
      <div className="flex flex-row">
        {isPlaySound ? (
          <button type="button" onClick={soundStop}>
            <Volume2 className="" size={20} />
          </button>
        ) : (
          <button type="button" onClick={soundStart}>
            <VolumeX className="" size={20} />
          </button>
        )}
        <input
          className="inline-block mx-2 w-2/12 text-sm font-medium"
          type="range"
          min="0"
          max="0.1"
          step="0.002"
          id="gain"
          value={gain}
          onChange={() => {
            let htmlEle = document.getElementById("gain") as HTMLInputElement
            let value: number = htmlEle.valueAsNumber
            setGain(value)
            if (masterGainNode.current)
              masterGainNode.current.gain.value = value
          }}
        ></input>
      </div>
      <div className="flex flex-row">
        <Activity className="" size={20} />
        <input
          className="inline-block mx-2 w-2/12 text-sm font-medium"
          type="range"
          min="110"
          max="880"
          step="10"
          id="freq"
          value={baseFreq}
          onChange={() => {
            let htmlEle = document.getElementById("freq") as HTMLInputElement
            let value: number = htmlEle.valueAsNumber
            setBaseFreq(value)
            if (oscNodes.current) {
              for (let i = 0; i < oscNodes.current.length; i++) {
                oscNodes.current[i].frequency.value = value * (i + 1)
              }
            }
          }}
        ></input>
      </div>
    </div>
  )
}

export default WaveSound
