import dynamic from 'next/dynamic'
import p5Types from 'p5'
import styles from './layout.module.css'
import { Point, renderPoints } from '../lib/point'
import {getWavePoints} from '../lib/wave'

const Sketch = dynamic(import('react-p5'), {
    loading: () => <></>,
    ssr: false
})



const SketchComponent = ({coefficient,theta}:{coefficient:number[][],theta:number}) => {
    const preload = (p5: p5Types) => {
        //load image
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2).parent(canvasParentRef)
        //todo setup
    }

    const draw = (p5: p5Types) => {
        // draw
        let colorGray = p5.color(220)
        let colorGrayAlpha = p5.color(0,80,80,120)
        p5.background(colorGray)
        let r = 100
    //    let coefficient:number[] = [1,0,-1/9,0,1/25,0,-1/49]
        let xPerPixel = 0.05
        let width = p5.windowWidth / 2
        let height = p5.windowHeight / 2

        p5.smooth()
        p5.strokeWeight(3)
        p5.stroke(colorGrayAlpha)
        p5.strokeCap(p5.SQUARE)
        coefficient.map( ele => {
      //      console.log(ele)
            let points: Point[] = getWavePoints({r,coefficient:ele,xPerPixel,width,height,theta})
            renderPoints(p5,points)
        })
     //   let points: Point[] = getWavePoints({r,coefficient,xPerPixel,width,height,theta})
       // renderPoints(p5, points)
      //  console.log("render wave")
    }

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth / 2, p5.windowHeight / 2)
    }

    return (
        <Sketch className={styles.sketch}
            preload={preload}
            setup={setup}
            draw={draw}
            windowResized={windowResized}
        />
    )
}

export default SketchComponent