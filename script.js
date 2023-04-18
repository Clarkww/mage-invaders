let images = [
    "./img/player.png",
    // "./img/monster.png",
    "./img/background.jpg",
    "./img/bluespell.png",
    "./img/alienRed.png",
    "./img/alienBlue.png",
    "./img/alienOrange.png",
    "./img/background2.png",
    "./img/background3.png",
    "./img/logo.png",
]

let loadedImages = {}
let numLoadedImages = 0

function startGame() {
    for (let i = 0; i < images.length; i++) {
        let img = new Image()
        img.src = images[i]
        img.onload = function() {
          numLoadedImages++
          if (numLoadedImages === images.length) {
            setInterval(update, 20)
          }
        }
        loadedImages[images[i]] = img
    }


    let canvas = document.getElementById("canvas")

    let ctx = canvas.getContext("2d")

    let score = 0

    let gameStarted = false

    let canvasHalfWidth = canvas.width / 2
    let playerX = canvasHalfWidth
    let playerY = canvas.height - 90
    let playerWidth = 50
    let playerHeight = 50
    let projectiles = []

    class Alien {
      constructor(x, y, width, height, speedX, speedY, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.speedX = speedX
        this.speedY = speedY
        this.image = image
      }

      move() {
        // Move left and right
        this.x += this.speedX
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
          this.speedX = -this.speedX
          this.y += this.speedY
        }
      }

      draw() {
        ctx.drawImage(loadedImages[this.image], this.x, this.y, this.width, this.height)
      }
    }

    class AlienRed extends Alien {
      constructor(x, y) {
        super(x, y, 50, 50, 3, 10, './img/alienRed.png')
      }
    }


    class AlienBlue extends Alien {
      constructor(x, y) {
        super(x, y, 50, 50, 3, 10, './img/alienBlue.png')
      }
    }

    class AlienOrange extends Alien {
      constructor(x, y) {
        super(x, y, 50, 50, 3, 10, './img/alienOrange.png')
      }
    }

    let aliens = []
    let numAliens = 10
    let alienSpacing = 50
    let alienRows = 3
    let alienCols = numAliens / alienRows
    let alienX = 0
    let alienY = 0
    let alienSpeedX = 3
    let alienSpeedY = 10
    let alienWidth = 50
    let alienHeight = 50

    for (let i = 0; i < alienRows; i++) {
      for (let j = 0; j < alienCols; j++) {
        let alien
        if (i === 0) {
          alien = new AlienRed(alienX, alienY)
        } else if (i === 1) {
          alien = new AlienBlue(alienX, alienY)
        } else {
          alien = new AlienOrange(alienX, alienY)
        }
        aliens.push(alien)
        alienX += alienWidth + alienSpacing
      }
      alienX = 0
      alienY += alienHeight + alienSpacing
    }
    


    function drawAliens() {
      for (let i = 0; i < aliens.length; i++) {
        aliens[i].move()
        aliens[i].draw()
      }
    }

    let winGame = () => {
        ctx.font = "30px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("You Win!", canvas.width / 2 - 50, canvas.height / 2)
    }

    let loseGame = () => {
        ctx.font = "30px Arial"
        ctx.fillStyle = "white"
        aliens = []
        ctx.fillText("You Lose!", canvas.width / 2 - 50, canvas.height / 2)
    }



    const text = "Press Space to Start";
    const textWidth = ctx.measureText(text).width;
    // ctx.fillText(text, canvas.width / 2 - textWidth / 2, canvas.height / 2 + ctx.font.size / 2);

    let startScreen = () => {
        ctx.drawImage(loadedImages['./img/background3.png'], 0, 0, canvas.width, canvas.height)
        ctx.drawImage(loadedImages['./img/logo.png'], canvas.width / 2 - 190, canvas.height / 2 - 200, 400, 400)
        ctx.font = "30px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("Press Space to Start", canvas.width / 2 - 120, canvas.height / 2 + 100)
        document.addEventListener('keydown', (event) => {
            if(event.keyCode === 32) {
                gameStarted = true
            }
        })
        // touch screen
        document.addEventListener('touchstart', (event) => {
            gameStarted = true
        })

    }

 

    
    function drawPlayer() {
        // console.log(loadedImages[images[0]])
        ctx.drawImage(loadedImages['./img/player.png'], playerX, playerY, playerWidth, playerHeight)
    }

    function drawProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
          ctx.drawImage(loadedImages['./img/bluespell.png'], projectiles[i].x, projectiles[i].y, 10, 30)
        }
    }
    let drawBackground = function() {
        ctx.drawImage(loadedImages['./img/background.jpg'], 0, 0, canvas.width, canvas.height)
    }

    let drawScore = () => {
        ctx.font = "30px Arial"
        ctx.fillStyle = "white"
        ctx.fillText("Score: " + score, 10, 50)
    }

    let draw = () => {
        if(!gameStarted) {
            startScreen()
        } else {
        drawBackground()
        drawPlayer()
        drawProjectiles()
        drawAliens() 
        drawScore()
      }
    }

    function updateProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
          projectiles[i].y -= 5
          if (projectiles[i].y < 0) {
            projectiles.splice(i, 1)
          }
        }
      }

      function updatePlayer() {
        if (playerX < 0) {
          playerX = 0
        } else if (playerX > canvas.width - playerWidth) {
          playerX = canvas.width - playerWidth
        }
      }

    let update = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        updateProjectiles()
        updatePlayer()

        aliens.forEach(alien => {
          alien.move()
          alien.draw()
        })

        draw()
        
        detectCollision()

        detectCollisionPlayer()

        if (score === 12) {  
          winGame()
        }
    }

    let shoot = () => {
        projectiles.push({
            x: playerX + playerWidth / 2,
            y: playerY
        })
    }

    function detectCollision() {
      for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < aliens.length; j++) {
          if (
            projectiles[i].x + 10 > aliens[j].x &&
            projectiles[i].x < aliens[j].x + aliens[j].width &&
            projectiles[i].y + 30 > aliens[j].y &&
            projectiles[i].y < aliens[j].y + aliens[j].height
          ) {
            projectiles.splice(i, 1)
            aliens.splice(j, 1)
            score++
            break
          }
        }
      }
    }

    function detectCollisionPlayer() {
      for (let i = 0; i < aliens.length; i++) {
        if (
          playerX + playerWidth > aliens[i].x &&
          playerX < aliens[i].x + aliens[i].width &&
          playerY + playerHeight > aliens[i].y &&
          playerY < aliens[i].y + aliens[i].height
        ) {
          loseGame()
        }
      }

    }

    document.addEventListener("keydown", function(event) {
        if (event.keyCode == 39) {
            playerX += 10
            
        }
        if (event.keyCode == 37) {
            playerX -= 10
        }
        if (event.keyCode == 32) {
            // shoot onces per second
            if (projectiles.length < 1) {
                shoot()
            }
        }

    })

    document.addEventListener("mousemove", function(event) {
      playerX = event.clientX - playerWidth / 2

    }
    )
    document.addEventListener("touchmove", function(event) {
        playerX = event.touches[0].clientX - playerWidth / 2
    }
    )

    document.addEventListener("click", function(event) {
        shoot()
    }
    )
  }
startGame()

