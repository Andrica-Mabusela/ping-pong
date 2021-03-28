const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

// set canvas width and height
const GAME_WIDTH = 1000
const GAME_HEIGHT = 600
canvas.width = GAME_WIDTH
canvas.height = GAME_HEIGHT


var player1Score = []
var player2Score = []


//Utility function
function randomIntFromRange(min, max){
	return ( Math.floor( Math.random() * (max - min - 1) + min) )
}


function clickSound(){
    var audio = document.querySelector('#audio')
    audio.play()
}


class Paddle{

	constructor(x, y,width, height, paddleColor){
		this.x = x
		this.y = y
		this.dy = 0
		this.width = width
		this.height = height
		this.speed = 5
		this.paddleColor = paddleColor
	}

	moveUp(){
		this.dy = -this.speed
	}

	moveDown(){
		this.dy = this.speed
	}

	draw(){
		ctx.fillStyle = this.paddleColor
		ctx.fillRect(this.x, this.y, this.width, this.height)
	}

	update(){

		// detect top and bottom walls
		if( this.y < 0 ){
			this.y = 0
		}

		if( this.y + this.height > GAME_HEIGHT ){
			this.y = GAME_HEIGHT - this.height
		}

		this.y += this.dy
		this.draw()
	}
}

// Listen for key down event
addEventListener('keydown', (event) => {

	// Paddle 1 controls
	if(event.key == 'ArrowUp'){
		paddle1.moveUp()
	}

	if(event.key == 'ArrowDown'){
		paddle1.moveDown()
	}

	// Paddle 2 controls
	if(event.key == 'a'){
		paddle2.moveUp()
	}

	if(event.key == 's'){
		paddle2.moveDown()
	}
})



// Listen for key up event
addEventListener('keyup', (event) => {

	// Paddle 1 controls
	if(event.key == 'ArrowUp'){
		paddle1.moveUp()
		paddle1.dy = 0
	}

	if(event.key == 'ArrowDown'){
		paddle1.moveDown()
		paddle1.dy = 0
	}

	// Paddle 2 controls
	if(event.key == 'a'){
		paddle2.moveUp()
		paddle2.dy = 0
	}

	if(event.key == 's'){
		paddle2.moveDown()
		paddle2.dy = 0
	}
})



// Create The ball blue print
class Ball{

	constructor(x, y, dx, dy, radius){
		this.velocities = [5, -5]
		this.x = x
		this.y = y
		this.dx = this.velocities[ Math.round( Math.random() ) ]
		this.dy = this.velocities[ Math.round( Math.random() ) ]
		this.radius = radius
	}

	draw(){

		ctx.beginPath()
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		ctx.fillStyle = 'white'
		ctx.strokeStyle = 'black'
		ctx.fill()
		ctx.stroke()
	}

	// top collision
	topAndBottomCollision(){
		
		if( this.y - this.radius <= 0 || this.y + this.radius >= GAME_HEIGHT){
			this.dy = -this.dy
		}

	}

	// Left paddle vs ball collision
	leftPaddleCollision(){
		let rightSideOfPaddle1 = paddle1.x + paddle1.width
		let topOfPaddle1 = paddle1.y
		let bottomOfPaddle1 = paddle1.y + paddle1.height

		if( this.x - this.radius <= rightSideOfPaddle1 && this.y + this.radius >= topOfPaddle1  && this.y - this.radius <= bottomOfPaddle1 ){
			clickSound()
			this.dx = 5
		}
	}

	// Right Paddle vs ball Collision
	rightPaddleCollision(){

		let leftSideOfPaddle2 = paddle2.x
		let bottomOfPaddle2 = paddle2.y + paddle2.height
		let topOfPaddle2 = paddle2.y

		if( this.x + this.radius >= leftSideOfPaddle2 && this.y + this.radius >= topOfPaddle2 && this.y - this.radius <= bottomOfPaddle2 ){
			clickSound()
			this.dx = -5
		}
	}



	update(){

		// top and bottom collision
		this.topAndBottomCollision()

		// left paddle vs ball collision
		this.leftPaddleCollision()

		// right paddle vs ball collision
		this.rightPaddleCollision()


		// move the ball
		this.x += this.dx
		this.y += this.dy

		// draw the ball after updating its coordinates
		this.draw()
	}
}




// Create Blue print for Score Boards
class ScoreBoard{

	constructor(x, y, color, points){
		this.x = x
		this.y = y
		this.color = color
		this.width = 150
		this.height = 100
		this.scoreA = false
		this.scoreB = false
		this.points = points
		
	}

	draw(){
	
		// write score
		ctx.fillStyle = 'white'
		ctx.font = "50px Arial"
		ctx.fillText(player1Score.length, GAME_WIDTH/2 - 150, 90)
		ctx.fillText(player2Score.length, GAME_WIDTH/2 + 150, 90)

		// players
		ctx.fillStyle = 'white'
		ctx.font = "30px Arial"
		ctx.fillText('Player 1', 20, 50)
		ctx.fillText('Player 2', GAME_WIDTH - 200, 50)


	}

	leftPaddleScore(){

		if(ball.x - ball.radius > GAME_WIDTH){
			this.scoreA = true
			if( this.scoreA === true){
				player1Score.push(this.scoreA)
				console.log(player1Score)
				this.scoreA = false
				gameStart()
			}
			
		}
	}

	rightPaddleScore(){

		if(ball.x + ball.radius < 0 ){
			this.scoreB = true

			if( this.scoreB === true){
				player2Score.push(this.scoreB)
				console.log(player2Score)
				this.scoreB = false
				gameStart()
			}
			
		}

	}

	update(){

		// Left paddle score
		this.leftPaddleScore()

		// right paddle score
		this.rightPaddleScore()

		this.draw()
	}


}


// Variables
var paddle1, paddle2, ballXpos, ballYpos, ball, board1, board2


function gameStart(){

	// Create paddles
	paddle1 = new Paddle(1, GAME_HEIGHT/2 - 100, 20, 200, 'white')
	paddle2 = new Paddle(GAME_WIDTH - 20, GAME_HEIGHT/2 - 100, 20, 200, 'white')

	// Create a ball
	ballXpos = randomIntFromRange(150, GAME_WIDTH - 150)
	ballYpos = randomIntFromRange(150, GAME_HEIGHT/2 + 150)
	ball = new Ball(ballXpos, ballYpos, 5, 5, 20) 

	// Score Boards
	board1 = new ScoreBoard(GAME_WIDTH/2 - 150, 30, 'black', 0)
	board2 = new ScoreBoard(GAME_WIDTH/2 + 150, 30, 'black', 0)

}



function divider(){
	let y = 5
	let h = 30
	for(let i = 0; i < 200; i++){

		ctx.fillStyle = 'white'
		ctx.fillRect(canvas.width/2, y, 5, h)
		y += h + 5
	}

}





// start the game
gameStart()



// event Listeners
addEventListener('keypress', pauseGame)
var isPaused = false
var currentSpeedX
var currentSpeedY

function pauseGame(event){

	currentSpeedX = ball.dx
	currentSpeedY = ball.dy


	if( event.key == ' ' ){
		isPaused = true

		ball.dx = 0
		ball.dy = 0

		paddle1.speed = 0
		paddle2.speed = 0

		document.querySelector('#pause-game').style.display = 'block'
		document.querySelector('#pause-game-content').style.display = 'flex'
	}

	if( isPaused ){
		removeEventListener('keypress', pauseGame)
	}
}



function resumeGame(){
	isPaused = false

	document.querySelector('#pause-game').style.display = 'none'
	document.querySelector('#pause-game-content').style.display = 'none'

	ball.dx = currentSpeedX
	ball.dy = currentSpeedY

	paddle1.speed = 5
	paddle2.speed = 5

	if( !isPaused ){
		addEventListener('keypress', pauseGame)
	}

}


// gameloop
function gameLoop(){
	ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)
	requestAnimationFrame(gameLoop)

	// paddles
	paddle1.update()
	paddle2.update()

	// Ball
	ball.update()

	// Score Board
	board1.update()
	board2.update()


	divider()


}


gameLoop()


// game instructions overlay

function showInstructions(){


		ball.dx = 0
		ball.dy = 0

		paddle1.speed = 0
		paddle2.speed = 0

	document.querySelector('#game-instructions-overlay').style.display = 'flex'
}


document.querySelector('#rm-instruction-btn').addEventListener('click', (event) => {

	ball.dx = 5
	ball.dy = 5

	paddle1.speed = 5
	paddle2.speed = 5

	document.querySelector('#game-instructions-overlay').style.display = 'none'
})


