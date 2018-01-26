let gameCanvas = document.getElementById('game')
let ctx = gameCanvas.getContext('2d')
let frame = 0

let random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Grid {
    constructor(context, cellWidth, cellHeight) {
        this.ctx = context
        this.cellWidth = cellWidth
        this.cellHeight = cellHeight

        this.maxX = gameCanvas.width / cellWidth - 1
        this.maxY = gameCanvas.height / cellHeight - 1
    }

    drawPoint(point, color = 'black') {
        let x = point.x * this.cellWidth
        let y = point.y * this.cellHeight
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, this.cellWidth - 1, this.cellHeight - 1)
    }

    drawLines() {
        for (let i = 0; i <= this.maxX; ++i)
            for (let j = 0; j <= this.maxY; j++) {
                this.ctx.lineWidth= 0.1
                this.ctx.strokeStyle = 'rgba(0,0,0,0.05)'
                this.ctx.beginPath();
                this.ctx.moveTo(i * this.cellWidth, 0)
                this.ctx.lineTo(i * this.cellWidth, gameCanvas.height)
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(0, j * this.cellHeight)
                this.ctx.lineTo(gameCanvas.width, j * this.cellHeight)
                this.ctx.stroke();
            }
    }
}

class Snake {
    constructor(grid, x, y) {
        this.grid = grid
        this.vx = 1
        this.vy = 0
        this.body = [new Point(x, y)]
        this.food = new Point(1, 1)
        this.food.constrain(grid)
        this.score = 0

        this.initKeyboard()
    }

    draw() {
        ctx.fillStyle = "#848484"
        ctx.fillText("Score: " + this.score, 10, 10);
        this.grid.drawPoint(this.food, 'red')

        this.body.forEach((point) => {
            this.grid.drawPoint(point)
        })

        let head = this.body[this.body.length - 1]
        ctx.fillStyle = 'rgba(255, 0, 0, .1)'
        ctx.fillRect(head.x * this.grid.cellWidth, 0, this.grid.cellWidth, gameCanvas.height)
        ctx.fillRect(0, head.y * this.grid.cellWidth, gameCanvas.width, this.grid.cellHeight)

        this.grid.drawPoint(this.body[this.body.length - 1], 'lime')
    }

    update() {
        let head = this.body[this.body.length - 1]
        let tail = this.body.shift()
        tail.x = head.x + this.vx
        tail.y = head.y + this.vy
        tail.constrain(this.grid)
        if (tail.equals(this.food)) {
            this.eat(this.food)
        }
        this.body.push(tail)
    }

    eat(point) {
        this.body.push(point)
        this.score++

        this.food = new Point(random(0, this.grid.maxX), random(0, this.grid.maxY))
        this.food.constrain(this.grid)
    }

    initKeyboard() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    if (this.vx == 0) {
                        this.vx = -1
                        this.vy = 0
                    }
                    break
                case "ArrowRight":
                    if (this.vx == 0) {
                        this.vx = 1
                        this.vy = 0
                    }
                    break
                case "ArrowUp":
                    if (this.vy == 0) {
                        this.vx = 0
                        this.vy = -1
                    }
                    break
                case "ArrowDown":
                    if (this.vy == 0) {
                        this.vx = 0
                        this.vy = 1
                    }
                    break
            }
        })
    }
}

class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    constrain(grid) {
        if (this.x > grid.maxX) {
            this.x = 0
        }

        if (this.x < 0) {
            this.x = grid.maxX
        }

        if (this.y > grid.maxY) {
            this.y = 0
        }

        if (this.y < 0) {
            this.y = grid.maxY
        }
    }

    equals(point) {
        return this.x == point.x && this.y == point.y
    }
}


let grid = new Grid(ctx, 10, 10)
let snake = new Snake(grid, 0, 0)

let draw = () => {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height)
    grid.drawLines()
    snake.update()
    snake.draw()
}

// start draw loop
let time = new Date().getTime()
raf = () => {
    window.requestAnimationFrame(() => {
        raf()
        let now = new Date().getTime()
        let elapsed = now - time
        if (elapsed > 50) {
            time = now
            frame++
            draw()
        }

    })
}
raf()