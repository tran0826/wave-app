import { Point } from "../../lib/point"
import {getWavePoints} from "../../lib/wave"

describe('wave test', () => {
    it('wave return number of Point equal width ',() => {
        const input = {r:0,coefficient:Array(10).fill(1),xPerPixel:1,width:10,height:10,theta:0}
        const result:Point[] = getWavePoints(input)
        expect(result.length).toBe(input.width)
    })
    it('wave return all zero when all coefficient height / 2', () => {
        const input = {r:0,coefficient:Array(10).fill(1),xPerPixel:1,width:10,height:10,theta:0}
        const result:Point[] = getWavePoints(input)
        expect(result.reduce((acc,ele) => {return acc + Math.abs(ele.y)} ,0)).toBe(input.width * input.height / 2)
    } )
})