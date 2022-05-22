import dynamic from 'next/dynamic'
import p5Types from 'p5'
import styles from './layout.module.css'
import { Point, renderPoints } from '../lib/point'
import {useRouter} from 'next/router'

const Sketch = dynamic(import('react-p5'), {
    loading: () => <></>,
    ssr: false
})



const SketchComponent = () => {
    let time = 0;
    const router = useRouter()
    const preload = (p5: p5Types) => {
        //load image
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth / 2, p5.windowHeight / 2).parent(canvasParentRef)
        //todo setup
    }

    //router.events.on('routeChangeStart',setup)
    const draw = (p5: p5Types) => {
        // draw
        p5.background(220)
        let points: Point[] = []
        const r = 200
        for (let i = 0; i < 500; i++) {
            points.push(new Point(i, r * Math.sin(i / 5 + time/10) + r + 10));
        }
        time+=1
        renderPoints(p5, points)
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