import { Point } from "./point"

export const getWavePoints = ({
  r,
  coefficient,
  xPerPixel,
  width,
  height,
  theta = 0,
}: {
  r: number
  coefficient: number[]
  xPerPixel: number
  width: number
  height: number
  theta?: number
}): Point[] => {
  let points: Point[] = []
  for (let pixel = 0; pixel < width; pixel++) {
    let y: number = coefficient.reduce((acc, ele, i) => {
      return acc + ele * r * Math.sin((i + 1) * (pixel + theta) * xPerPixel)
    }, 0)
    points.push({ x: pixel, y: y + height / 2 })
  }
  return points
}

//-1 to 1
export const getWaveCoefficient = (number: number) => {
  //todo calclate random coefficient
  let coefficient: number[] = Array(number)
  coefficient[0] = Math.round((0.7 * Math.random() + 0.3) * 100) / 100
  for (let i = 1; i < number; i++) {
    coefficient[i] = Math.round((2 * Math.random() - 1) * 100) / 100
  }
  return coefficient
}

export const calcWaveSimilarity = (
  coefficient1: number[],
  coefficient2: number[],
) => {
  let acc = 0
  for (let i = 0; i < 125; i++) {
    const x = i / 20
    let a = coefficient1.reduce((acc, ele, id) => {
      return acc + ele * Math.sin((id + 1) * x)
    }, 0)
    let b = coefficient2.reduce((acc, ele, id) => {
      return acc + ele * Math.sin((id + 1) * x)
    }, 0)
    acc += Math.abs(a - b)
  }
  return acc
}
