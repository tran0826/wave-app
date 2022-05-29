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
        coefficient[i] = Math.random()
    }
   // console.log(coefficient)
    return coefficient
}