import p5Types from 'p5'

export class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}

export function renderPoints(p5: p5Types, points: Point[]) {
    //POINTS, LINES, TRIANGLES, TRIANGLE_FAN TRIANGLE_STRIP, QUADS, or QUAD_STRIP
    if (points.length == 0) return

    p5.beginShape(p5.LINES)
    let pre = points[0]
    points.forEach(e => {
        p5.vertex(pre.x,pre.y)
        p5.vertex(e.x, e.y)
        pre = e
    })
    p5.endShape()
}