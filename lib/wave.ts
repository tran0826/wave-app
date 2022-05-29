import { Point } from "./point"

export const getWavePoints = (
    {r,coefficient,xPerPixel,width,height,theta = 0}:
    {r:number,coefficient:number[],xPerPixel:number,width:number,height:number,theta?:number}) : Point[] => {
    let points:Point[] = []
    for(let pixel = 0; pixel<width; pixel++){
        let y: number= coefficient.reduce(
            (acc,ele,i) => {
                return acc + ele * r * Math.sin((i + 1) * (pixel + theta) * xPerPixel)
            },0)
        points.push({x: pixel,y: y + height / 2})
    }
    return points
}

export const getWaveCoefficient = (number: number) => {
    //todo calclate random coefficient
    let coefficient:number[] = Array(number)
    for(let i = 0; i < number; i++){
        coefficient[i] = Math.round(Math.random() * 100)/100
    }
    console.log(coefficient)
    return coefficient
}

export const calcWaveSimilarity = (coefficient1:number[],coefficient2:number[]) => {
 //   assert(coefficient1.length === coefficient2.length)
    let acc = 0
    for(let i = 0;i<125;i++){
        const x = i / 20
        let a = coefficient1.reduce(
            (acc,ele,i) => {
                return acc + ele * Math.sin((i + 1) * x)
            },0)
        let b = coefficient2.reduce(
            (acc,ele,i) => {
                return acc + ele * Math.sin((i + 1) * x)
            },0)
        acc += Math.abs(a - b)
    }
    return acc
}