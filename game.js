const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5
const winReq = 22495
class Player {
	constructor() {
			this.speed = 10
			this.position = {
				x: 100,
				y: 300			
			}
		this.velocity = {
			x: 0,
			y: 1
		}
		this.width = 110
		this.height = 157

		this.image = createImage(spriteStandRight)
		this.frames = 0
		this.sprites = {
			stand: {
				right: createImage(spriteStandRight),
				left: createImage(spriteStandLeft),
			},
			run: {
				right: createImage(spriteRunRight),
				left: createImage(spriteRunLeft)
			}
		}

		this.currentSprite = this.sprites.stand.right
		this.currentCropWidth = 353
		this.leftOffset = 263
		this.lives = 1
		this.score = 0
		this.count = 0
		this.time = 0
	}

	draw() {
		context.drawImage(
			this.currentSprite,
			(this.currentCropWidth+this.leftOffset)*this.frames,
			25,
			this.currentCropWidth,
			470,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update() {
		if (this.count == 60){this.time ++
			this.count = 0}
		this.count ++
		this.frames++
		if(this.frames > 29) this.frames = 0
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + 
			this.velocity.y <= canvas.height)
			this.velocity.y += gravity
	}
}

class InterfaceLife {
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

class Powerup {
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

class Enemy {
	constructor(x, y) {
		this.position = {
			x,
			y		
		}
		this.velocity = {
			x: -0.5,
			y: 1
		}
		this.width = 80
		this.height = 80

		this.image = createImage(enemyRunLeft)
		this.frames = 0
		this.sprites = {
				right: createImage(enemyRunRight),
				left: createImage(enemyRunLeft)
		}
		

		this.currentSprite = this.sprites.left
		this.currentCropWidth = 225
		this.lives = 1
	}

	draw() {
		context.drawImage(
			this.image,
			this.currentCropWidth*this.frames,
			0,
			this.currentCropWidth,
			225,
			this.position.x,
			this.position.y,
			this.width,
			this.height
		)
	}

	update() {
		this.frames++
		if(this.frames > 29) this.frames = 0
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
		if (this.position.y+this.height+this.velocity.y <= canvas.height)
            this.velocity.y += gravity

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
let platformSmallShort = '/img/platformSmallShort.png'

let spriteRunLeft = '/img/spriteRunLeft.png'
let spriteRunRight = '/img/spriteRunRight.png'
let spriteStandLeft = '/img/spriteStandLeft.png'
let spriteStandRight = '/img/spriteStandRight.png'
let mom1 = '/img/mom1.png'
let mom2 = '/img/mom2.png'
let lives = '/img/heart.png'
let powerupSprite = '/img/powerupSprite.png'
let blahajSprite = '/img/blahajSprite.png'
let speechBubble1 = '/img/speechBubble1.png'
let speechBubble2 = '/img/speechBubble2.png'
let speechBubble3 = '/img/speechBubble3.png'

let enemyRunLeft = '/img/enemyRunLeft.png'
let enemyRunRight = '/img/enemyRunRight.png'

function createImage(imageSrc){
	const image = new Image()
	image.src = imageSrc
	return image
}

function livesUpdate(){
	let xvalue= 850
	let yvalue=0
	for (let i=0; i<player.lives; i++){
			interfaceLives.push(new InterfaceLife({x:xvalue,y:yvalue,image:livesImage}))
			xvalue+= 52
		}
	
	}

let player = new Player()

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
let platformSmallShortImage = createImage(platformSmallShort)

let enemyRunLeftImage = createImage(enemyRunLeft)
let enemyRunRightImage = createImage(enemyRunRight)

let livesImage= createImage(lives)

let interfaceLives=[]
let powerups = []
let platforms = []
let genericObjects = []
let enemies = []
let speechBubbles = []

let keys = {
	right: {
		pressed: false
	},
	left: {
		pressed: false
	}
}

let scrollOffset = 0
let shownLoseAlert = false
let shownWinAlert = false
let blahajCollected = false
//let blahajCollected = true

function init(){ //<================================================ INIT
player = new Player()

powerups = [
	new Powerup({x: platformImage.width * 13 - 160, y: 70 ,image: createImage(powerupSprite)}),
	new Powerup({x: platformImage.width * 25 + 250, y: 0 ,image: createImage(powerupSprite)}),
	new Powerup({x: platformImage.width * 17 - 380, y: 140 - powerupSprite.height ,image: createImage(powerupSprite)})	
]

enemies = []
enemies.push(new Enemy(1500,50))
enemies.push(new Enemy(platformImage.width * 4 + 550,50))
enemies.push(new Enemy(platformImage.width * 9 + 10,50))
enemies.push(new Enemy(platformImage.width * 10 + 10,50))
enemies.push(new Enemy(platformImage.width * 14,50))
enemies.push(new Enemy(platformImage.width * 13,50))
enemies.push(new Enemy(platformImage.width * 16 + 50,270))
enemies.push(new Enemy(platformImage.width * 21 + 10,50))
enemies.push(new Enemy(platformImage.width * 26 - 100,20))
enemies.push(new Enemy(platformImage.width * 31 + 10,20))
enemies.push(new Enemy(platformImage.width * 35 + 70,270))

livesUpdate()

platforms = [
	new Platform({x: 360, y: 173, image: createImage(mom1)}),
	new Platform({x: platformSmallTallImage.width * 5 + 180, y: 420, image: platformSmallTallImage}),
	new Platform({x: -2, y: 520, image: platformImage}),
	new Platform({x: platformImage.width-4, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 2 + 200, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 3 + 550, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 4 + 550, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 6 + 150, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 7 + 280, y: 410, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 7 + 320, y: 180, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 8 + 120, y: 320, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 8 + 180, y: 150, image: platformImage}),
	new Platform({x: platformImage.width * 10 + 0, y: 550, image: platformImage}),
	new Platform({x: platformImage.width * 11 + 50, y: 420, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 12 - 100, y: 290, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 13 - 220, y: 170, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 13 - 220, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 14 - 220, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 15 - 160, y: 400, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 16 - 300, y: 270, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 17 - 380, y: 140, image: platformImage}),
	new Platform({x: platformImage.width * 17 + 270, y: 450, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 17 - 380, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 18, y: 410, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 18 + 200, y: 510, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 19 - 90, y: 310, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 20 + 150, y: 290, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 20 , y: 350, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 20 + platformSmallTallImage.width - 31, y: 350, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 19 + 480, y: 410, image: platformSmallShortImage}),
	//blahaj collected ==> checkpoint
	new Platform({x: platformImage.width * 21 - 1, y: 550, image: platformImage}),
	new Platform({x: platformImage.width * 22 + 140, y: 500, image: platformImage}),
	new Platform({x: platformImage.width * 23 + 280, y: 460, image: platformImage}),
	new Platform({x: platformImage.width * 24 + 420, y: 330, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 24, y: 200, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 24 + 420, y: 90, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 25 + 250, y: 100, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 26, y: 200, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 26, y: 350, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 26, y: 500, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 26 - platformSmallShortImage.width/2, y: 500, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 27 - 150, y: 250, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 27 - 150, y: 400, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 28 - 150, y: 325, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 29 - 150, y: 325, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 29, y: 325, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 29 - 50, y: 325, image: platformSmallShortImage}),
	//
	new Platform({x: platformImage.width * 30 - 100, y: 210, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 30 - 100, y: 510, image: platformImage}),
	new Platform({x: platformImage.width * 31, y: 410, image: platformSmallTallImage}),
	new Platform({x: platformImage.width * 32 - 200, y: 310, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 32 - 100, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 32 + 350, y: 310, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 33 + 100, y: 410, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 34 - 100, y: 510, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 34 + 20, y: 290, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 35 + 50, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 35 + 250, y: 390, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 36 + 100, y: 265, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 36 + 300, y: 515, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 37 + 110, y: 265, image: platformSmallShortImage}),
	new Platform({x: platformImage.width * 38 + 220, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 39 + 170, y: 520, image: platformImage}),
	new Platform({x: platformImage.width * 39 + 220, y: 173, image: createImage(mom2)}),
	new Platform({x: platformImage.width * 40 + 160, y: 520, image: platformImage}),
	//blahaj collectible
	new Platform({x: platformImage.width * 20 + 250, y: 130, image: createImage(blahajSprite)}),
]
genericObjects = [
	new GenericObject({x: -1, y: -1, image: createImage(background)}),
	new GenericObject({x: -1, y: -1, image: createImage(hills)})
]
speechBubbles = [
	new Platform({x: 190, y: 18, image: createImage(speechBubble1)}),
	new Platform({x: platformImage.width * 39 + 200, y: 18, image: createImage(speechBubble2)}),
	new Platform({x: platformImage.width * 12, y: 90, image: createImage(speechBubble3)})
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

if (blahajCollected == true) {
	scrollOffset = 11750
	platforms.forEach((Platform) => {
		Platform.position.x -= scrollOffset
	})
	enemies.forEach((Enemy) => {
		Enemy.position.x -= scrollOffset
	})		
	genericObjects[0].position.x -=scrollOffset * 0.5
	genericObjects[1].position.x -=scrollOffset * 0.66
	player.position.y = 10
	platforms.pop()
	}
}

function animate(){
	requestAnimationFrame(animate)
	context.fillStyle = 'white'
	context.fillRect(0,0,canvas.width,canvas.height)
	
	genericObjects.forEach(GenericObject =>{
		GenericObject.draw()
	})
	platforms.forEach(Platform => {
		Platform.draw()
	})
	powerups.forEach(Powerup => {
		Powerup.draw()
	})
	enemies.forEach(Enemy => {
		if (Enemy.velocity.x > 0) Enemy.image = Enemy.sprites.right
		else if (Enemy.velocity.x < 0)Enemy.image = Enemy.sprites.left
		Enemy.update()
	})
	interfaceLives.forEach(live =>[
		live.draw()
	])
	if(scrollOffset>0 && scrollOffset<280) speechBubbles[0].draw()
	if(scrollOffset>22440) speechBubbles[1].draw()
	if(scrollOffset>=6440 && scrollOffset<6660) speechBubbles[2].draw()
	context.font = "50px arial";
	context.fillText("TIMER:" + player.time ,20,50)
	context.fillText("SCORE: "+ player.score,350,50)
	context.fillText("LIVES:",700,50)
	
	player.update()
	
	if (keys.right.pressed && player.position.x < 400) {
		player.velocity.x = player.speed
	} else if ((keys.left.pressed && player.position.x > 100)
		|| (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
		player.velocity.x = -player.speed
	} else {
		player.velocity.x = 0

		if (keys.right.pressed && scrollOffset < winReq) {
			scrollOffset += player.speed
			platforms.forEach((Platform) => {
				Platform.position.x -= player.speed
			})
			speechBubbles.forEach((Platform) => {
				Platform.position.x -= player.speed
			})
			enemies.forEach((Enemy) => {
				Enemy.position.x -= player.speed
			})
			powerups.forEach((Powerup) => {
				Powerup.position.x -= player.speed
			})	
			genericObjects[0].position.x -=player.speed * 0.5
			genericObjects[1].position.x -=player.speed * 0.66
		} else if (keys.left.pressed && scrollOffset > 0){
			scrollOffset -= player.speed
			platforms.forEach((Platform) => {
				Platform.position.x += player.speed
			})
			speechBubbles.forEach((Platform) => {
				Platform.position.x += player.speed
			})
			enemies.forEach((Enemy) => {
				Enemy.position.x += player.speed
			})
			powerups.forEach((Powerup) => {
				Powerup.position.x += player.speed
			})
			genericObjects[0].position.x +=player.speed * 0.5
			genericObjects[1].position.x +=player.speed * 0.66
		}
	}

	// platform collision detection
	platforms.forEach(platform => {
		if (player.position.y + player.height <= platform.position.y &&
			player.position.y + player.height + player.velocity.y >= platform.position.y &&
			player.position.x + player.width-40 >= platform.position.x &&
			player.position.x <= platform.position.x + platform.width - 15 &&
			player.lives > 0
			) {
			player.velocity.y = 0
		}
	})

	enemies.forEach(enemy =>{
		if (player.position.y + player.height <= enemy.position.y &&
			player.position.y + player.height + player.velocity.y >= enemy.position.y &&
			player.position.x + (player.width) >= enemy.position.x &&
			player.position.x <= enemy.position.x + enemy.width
			) {
				let index = enemies.indexOf(enemy)
				enemies.splice(index,1)
				player.score = player.score + 10
		} else if (
			player.position.x + player.width-35  >= enemy.position.x &&
			player.position.x <= enemy.position.x + enemy.width &&
			player.position.y+player.height < enemy.position.y+enemy.height &&
			player.position.y+player.height > enemy.position.y) {
				player.velocity.y -= 10
				if(player.currentSprite == player.sprites.stand.right ||
					player.currentSprite == player.sprites.run.right)
					player.velocity.x -= 50
				else if (player.currentSprite == player.sprites.stand.left ||
					player.currentSprite == player.sprites.run.left)
					player.velocity.x += 50				
				player.lives--
				interfaceLives.pop()
				//if (player.lives == 0) return
		}
	})
	// platform enemy collision detection
	enemies.forEach(enemy => {
		platforms.forEach(platform => {
			if (enemy.position.y + enemy.height <= platform.position.y &&
				enemy.position.y + enemy.height + enemy.velocity.y >= platform.position.y &&
				enemy.position.x + enemy.width>= platform.position.x &&
				enemy.position.x <= platform.position.x + platform.width
				) {
				enemy.velocity.y = 0
			}
			if (enemy.position.x  + enemy.width == platform.position.x + platform.width 
                || enemy.position.x == platform.position.x
				) {
					//console.log("edge")
					enemy.velocity.x = (enemy.velocity.x) *-1
			}
			
		})
	})

	powerups.forEach(Powerup =>{
		if (player.position.y <= Powerup.position.y &&
			player.position.y + player.height >= Powerup.position.y + Powerup.height &&
			player.position.x <= Powerup.position.x &&
			player.position.x + player.width >= Powerup.position.x + Powerup.width){
				let index = powerups.indexOf(Powerup)
				powerups.splice(index,1)
				player.lives++
				livesUpdate()
			}
	})
	
	if (scrollOffset > 11400
		&& (player.position.y > 120 && player.position.y < 300)
		&& blahajCollected == false){
		blahajCollected = true
		console.log("blahaj collected")
		platforms.pop()
	}
	
	//win condition
	if (scrollOffset > winReq
		&& shownWinAlert == false) {
		blahajCollected = false
		alert('You Win!')
		shownWinAlert = true
		init()
	}

	//lose condition
	if (player.lives == 0){
		player.velocity.x -= player.velocity.x
		//player.velocity.y -= 50
	}
	if ((player.position.y - 3*player.height > canvas.height)
		&& shownLoseAlert==false) {
		alert("You lose!")
		shownLoseAlert = true
		init()
	}
}

init()
animate()

var lastPressed = 0
window.addEventListener('keydown', ({key}) => {
	switch (key){
		case 'a':
			keys.left.pressed = true
			player.currentSprite = player.sprites.run.left
			player.currentCropWidth = 353 
			player.leftOffset = 263
			break

		case 's':
			if (player.position.y < 360) player.velocity.y += gravity + 2
			break

		case 'd':
			keys.right.pressed = true
			player.currentSprite = player.sprites.run.right
			player.currentCropWidth = 353 
			player.leftOffset = 263
			break

		case 'w':
			var now = new Date()
			if (now - lastPressed < 500) player.velocity.y = 0
			else {
			if (event.repeat) { return }
			player.velocity.y -= 21
			lastPressed = new Date()
			}
			break
	}
})

window.addEventListener('keyup', ({key}) => {
	switch (key){
		case 'a':
			keys.left.pressed = false
			player.currentSprite = player.sprites.stand.left
			break

		case 's':
			break

		case 'd':
			keys.right.pressed = false
			player.currentSprite = player.sprites.stand.right
			break

		case 'w':
			break
	}
})