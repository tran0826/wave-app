import dynamic from "next/dynamic"
import p5Types from "p5"
import { Point, renderPoints } from "../lib/point"
import { calcWaveSimilarity, getWavePoints } from "../lib/wave"
import styles from "./layout.module.css"

const Sketch = dynamic(import("react-p5"), {
  loading: () => <></>,
  ssr: false,
})

const SketchComponent = ({
  xPerPixel = 0.01,
  answerCoefficient = undefined,
  userCoefficient,
  theta,
}: {
  xPerPixel?: number
  answerCoefficient?: number[] | undefined
  userCoefficient: number[]
  theta: number
}) => {
  const preload = (p5: p5Types) => {
    //load image
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth * 0.8, p5.windowHeight / 2).parent(
      canvasParentRef,
    )
    //todo setup
  }

  const draw = (p5: p5Types) => {
    // draw
    let colorGray = p5.color(220)
    let colorGrayAlpha = p5.color(0, 80, 80, 120)
    let colorBlue = p5.color(0, 0, 255)
    let colorRed = p5.color(255, 0, 0)
    p5.background(colorGray)
    let r = 100
    //    let coefficient:number[] = [1,0,-1/9,0,1/25,0,-1/49]
    //    let xPerPixel = 0.05
    let width = p5.windowWidth * 0.8
    let height = p5.windowHeight / 2
    if (width <= 600) xPerPixel = 0.025
    p5.smooth()
    p5.strokeWeight(3)
    p5.strokeCap(p5.SQUARE)
    let points: Point[]
    if (answerCoefficient) {
      p5.stroke(colorGrayAlpha)
      points = getWavePoints({
        r,
        coefficient: answerCoefficient,
        xPerPixel,
        width,
        height,
        theta,
      })
      renderPoints(p5, points)
    }

    if (
      answerCoefficient &&
      calcWaveSimilarity(userCoefficient, answerCoefficient) <= 10
    ) {
      p5.stroke(colorRed)
    } else {
      p5.stroke(colorBlue)
    }
    points = getWavePoints({
      r,
      coefficient: userCoefficient,
      xPerPixel,
      width,
      height,
      theta,
    })
    renderPoints(p5, points)
  }

  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(p5.windowWidth * 0.8, p5.windowHeight / 2)
  }

  return (
    <Sketch
      className={styles.sketch}
      preload={preload}
      setup={setup}
      draw={draw}
      windowResized={windowResized}
    />
  )
}

export default SketchComponent
