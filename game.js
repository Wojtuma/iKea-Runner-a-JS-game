const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5
const winReq = 2000
class Player {
	constructor() {
			this.speed = 10
			this.position = {
				x: 100,
				y: 100			
			}
		this.velocity = {
			x: 0,
			y: 1
		}
		this.width = 66
		this.height = 150

		this.image = createImage(spriteStandRight)
		this.frames = 0
		this.sprites = {
			stand: {
				right: createImage(spriteStandRight),
				left: createImage(spriteStandLeft),
				cropWidth: 177
			},
			run: {
				right: createImage(spriteRunRight),
				cropWidth: 340
				//width: 127.875
			}
		}

		this.currentSprite = this.sprites.stand.right
		this.currentCropWidth = 177
	}

	draw() {
		context.drawImage(this.currentSprite,
			this.currentCropWidth*this.frames,
			0,
			this.currentCropWidth,
			400,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update() {
		this.frames++
		if(this.frames > 28) this.frames = 0
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + 
			this.velocity.y <= canvas.height)
			this.velocity.y += gravity
		//else this.velocity.y = 0
	}
}

class Platform {
	constructor({x, y, image}){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw() {
		context.drawImage(this.image, this.position.x, this.position.y)
	}

}

class GenericObject {
	constructor({x, y, image}){
		this.position = {
			x,
			y
		}
		this.image = image
		this.width = image.width
		this.height = image.height
	}

	draw() {
		context.drawImage(this.image, this.position.x, this.position.y)
	}

}

let platform = '/img/platform.png'
let background = '/img/background.png'
let hills = '/img/hills.png'
let platformSmallTall = '/img/platformSmallTall.png'

let spriteRunLeft = '/img/spriteRunLeft.png'
let spriteRunRight = '/img/spriteRunRight.png'
let spriteStandLeft = '/img/spriteStandLeft.png'
let spriteStandRight = '/img/spriteStandRight.png'

function createImage(imageSrc){
	const image = new Image()
	image.src = imageSrc
	console.log(image.src)
	return image
}

let player = new Player()

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
let platforms = []
let genericObjects = []

let keys = {
	left: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

let scrollOffset = 0
let shownLoseAlert = false
let shownWinAlert = false

function init(){
player = new Player()

platforms = [
	new Platform({x: platformSmallTallImage.width * 5 + 180, y: 320, image: platformSmallTallImage}),

	new Platform({x: -1, y: 460, image: platformImage}),
	new Platform({x: platformImage.width-4, y: 460, image: platformImage}),
	new Platform({x: platformImage.width * 2 + 200, y: 460, image: platformImage}),
	new Platform({x: platformImage.width * 3 + 510, y: 460, image: platformImage})

]
genericObjects = [
	new GenericObject({x: -1, y: -1, image: createImage(background)}),
	new GenericObject({x: -1, y: -1, image: createImage(hills)})
]

keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

scrollOffset = 0
shownLoseAlert = false
shownWinAlert = false
}

function animate(){
	requestAnimationFrame(animate)
	context.fillStyle = 'white'
	context.fillRect(0,0,canvas.width,canvas.height)
	
	genericObjects.forEach(genericObjects =>{
		genericObjects.draw()
	})

	platforms.forEach(platform => {
		platform.draw()
	})
	player.update()
	
	if (keys.right.pressed && player.position.x < 400) {
		player.velocity.x = player.speed
	} else if ((keys.left.pressed && player.position.x > 100)
		|| (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
		player.velocity.x = -player.speed
	} else {
		player.velocity.x = 0

		if (keys.right.pressed) {
			scrollOffset += player.speed
			platforms.forEach((Platform) => {
				Platform.position.x -= player.speed
			})
			genericObjects.forEach((GenericObject) => {
				GenericObject.position.x -=player.speed * 0.66
			})
		} else if (keys.left.pressed && scrollOffset > 0){
			scrollOffset -= player.speed
			platforms.forEach((Platform) => {
				Platform.position.x += player.speed
			})
			genericObjects.forEach((GenericObject) => {
				GenericObject.position.x +=player.speed * 0.66
			})
		}
	}

	// platform collision detection
	platforms.forEach(platform => {
		if (player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y >= platform.position.y &&
			player.position.x + player.width >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width
			) {
			player.velocity.y = 0
		}
	})

	//win condition
	if (scrollOffset > winReq  && shownWinAlert==false) {
		alert('You Win!')
		shownWinAlert = true
		init()
	}

	//lose condition
	if(player.position.y - 3*player.height > canvas.height && shownLoseAlert==false) {
		alert("You lose!")
		shownLoseAlert = true
		init()
	}
}

init()
animate()

window.addEventListener('keydown', ({key}) => {
	console.log(key)
	switch (key){
		case 'a':
			console.log('left')
			keys.left.pressed = true
			break

		case 's':
			console.log('down')
			break

		case 'd':
			console.log('right')
			keys.right.pressed = true
			player.currentSprite = player.sprites.run.right
			player.currentCropWidth = player.sprites.run.cropWidth
			break

		case 'w':
		case "ArrowUp":
		case "":
			console.log('up')
			player.velocity.y -= 20
			break
	}
})

window.addEventListener('keyup', ({key}) => {
	console.log(key)
	switch (key){
		case 'a':
			console.log('left')
			keys.left.pressed = false
			break

		case 's':
			console.log('down')
			break

		case 'd':
			console.log('right')
			keys.right.pressed = false
			break

		case 'w':
			console.log('up')
			break
	}
})