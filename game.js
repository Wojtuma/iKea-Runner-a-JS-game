const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5
class Player {
	constructor() {
			this.position = {
				x: 100,
				y: 100			
			}
		this.velocity = {
			x: 0,
			y: 1
		}
		this.width = 30
		this.height = 30
	}

	draw() {
	context.fillStyle = 'red'
	context.fillRect(this.position.x, this.position.y, this.width, this.height
		)
	}

	update() {
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + 
			this.velocity.y <= canvas.height)
			this.velocity.y += gravity
		else this.velocity.y = 0
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

function createImage(imageSrc){
	const image = new Image()
	image.src = imageSrc
	console.log(image.src)
	return image
}

const player = new Player()

const platformImage = createImage(platform)
const platforms = [
	new Platform({x: -1, y: 460, image: platformImage}),
	new Platform({x: platformImage.width-4, y: 460, image: platformImage})
]
const genericObject = [
	new GenericObject({x: -1, y: -1, image: createImage(background)}),
	new GenericObject({x: -1, y: -1, image: createImage(hills)})
]

const keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

let scrollOffset = 0

function animate(){
	requestAnimationFrame(animate)
	context.fillStyle = 'white'
	context.fillRect(0,0,canvas.width,canvas.height)
	
	genericObject.forEach(genericObject =>{
		genericObject.draw()
	})

	platforms.forEach(platform => {
		platform.draw()
	})
	player.update()
	
	if (keys.right.pressed && player.position.x < 400) {
		player.velocity.x = 5
	} else if (keys.left.pressed && player.position.x > 100) {
		player.velocity.x = -5
	} else {
		player.velocity.x = 0
		if (keys.right.pressed) {
			scrollOffset += 5
			platforms.forEach(platform => {
				platform.position.x -= 5
			})
		} else if (keys.left.pressed){
			scrollOffset -= 5
			platforms.forEach(platform => {
				platform.position.x += 5
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

	if (scrollOffset > 1500) {
		alert('You Win!')
	}
}

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