
let playingField = document.getElementById("playing_field");
playingField.width = window.innerWidth;
playingField.height = window.innerHeight;

let ctx = playingField.getContext("2d");

let keyPress = {};
document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

let col = {}

function bindKeyControlls(forward, backward, turnLeft, turnRight) {
    return {
        FORWARD: forward,
        BACKWARD: backward,
        TURN_LEFT: turnLeft,
        TURN_RIGHT: turnRight
    }
}


function random(min, max) {
    return min + Math.random() * (max - min);
}

function setPoint(x, y) {
    return {
        x, y
    }
}

class Background {
    constructor(options) {
        let { pointsOffsetSpeed,
              gridOffsetSpeed,
              contextCanvas } = options;

        this.pointsOffsetSpeed = pointsOffsetSpeed;
        this.gridOffsetSpeed = gridOffsetSpeed;
        this.contextCanvas = contextCanvas;

        this._target = null;
        this.moveX = 0;
        this.moveY = 0;
    }
    setCameraTarget(target) {
        this._target = target;
    }
    render() {
        let offsetX = - this._target.x * this.pointsOffsetSpeed;
        let offsetY = - this._target.y * this.pointsOffsetSpeed;
        this.drawPoints(25, 50, true, offsetX ,offsetY);

        offsetX = - this._target.x * this.gridOffsetSpeed;
        offsetY = - this._target.y * this.gridOffsetSpeed;
        this.drawGrid(0, 100, true, offsetX, offsetY);
    }
    offsetMode() {
        this.moveX -=  5;
        this.moveY = 1;
        let bound = -500;

        if (this.moveX < bound ) {
            this.moveX = 0;
        };

        this.drawPoints(25, 50, true, this.moveX/2, this.moveY);
        this.drawGrid(0, 100, true, this.moveX, this.moveY);

    }
    drawPoints(offset, freq, isTranslate, offsetX, offsetY) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate(offsetX, offsetY);
        }
        this.contextCanvas.fillStyle = "#2a3849";
        for (let i = 0; i< 4000/freq; i++) {
            for (let j = 0; j< 2000/freq; j++) {
                ctx.moveTo(offset + i*freq,j*freq + offset);
                ctx.arc(offset + i*freq,j*freq + offset, 1,0,Math.PI*2);
            }
        }
        this.contextCanvas.fill();
        this.contextCanvas.closePath();
        this.contextCanvas.restore();
    }
    drawGrid(offset, freq, isTranslate, offsetX, offsetY) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate(offsetX, offsetY);
        }
        this.contextCanvas.strokeStyle = "#1e2f46";
        this.contextCanvas.lineWidth = 1;
        for (let i = 0; i<5000/freq; i++) {
            this.contextCanvas.moveTo(offset + i*freq, 0);
            this.contextCanvas.lineTo(offset + i*freq, 5000);

            this.contextCanvas.moveTo(0, i*freq + offset);
            this.contextCanvas.lineTo(5000, i*freq + offset);
        }
        this.contextCanvas.stroke();
        this.contextCanvas.closePath();
        this.contextCanvas.restore();
    }
}

class LightCycle {
    constructor(options) {
        let { startPosition,
              startAngle,
              mainColor, 
              maxSpeed, 
              rotationSens, 
              keyControlls, 
              spriteSrc, 
              traceMaxLength,
              contextCanvas } = options;

        this.x = startPosition.x;
        this.y = startPosition.y;
        this.colorObject = mainColor;
        this.mainColor = `rgb(${mainColor.r},${mainColor.g},${mainColor.b})`;
        this.maxSpeed = maxSpeed;
        this.rotationSens = rotationSens;
        this.keyControlls = keyControlls;
        this.traceMaxLength = traceMaxLength; 
        this.contextCanvas = contextCanvas;


        this._img = new Image();
        this._img.src = spriteSrc;
        this._angle = startAngle;
        this._rad = 0;
        this._traceArr = [];
        this.collision = setPoint(0,0);

        this.isCollision = false;
        this.a = 1;
        this.explosion = false;
    }
    setEnemy(enemy) {
        this.enemy = enemy;
    }
    render() {
        this.drawTrace(4, 10, 10);

        this.contextCanvas.save();
        this.contextCanvas.translate(this.x, this.y);
        this.contextCanvas.rotate(this._rad);

        if (this.isCollision ) {
            this.a += 2;
            this.drawCycle(-20, -20, this.a );
            // this.drawWheels(16, -1, 24/this.a, 12/this.a, 12, 3, 10);

        } else {
            this.drawCycle(-20, -20, 2);
            this.drawWheels(16, -1, 24, 12, 12, 3, 10);
        }

        this.contextCanvas.restore();


        // this.contextCanvas.save();
        // this.contextCanvas.translate(this.x, this.y);
        // this.contextCanvas.font = "125px Tr2n";
        // this.contextCanvas.fillStyle = this.mainColor;
        // this.contextCanvas.fillText("8",500, 500);
        // this.contextCanvas.restore();

        this.update();
    }
    drawTrace(traceRadius, cycleRadius, lightRadius) {
        this.contextCanvas.beginPath();

        this.contextCanvas.lineWidth = traceRadius;
        this.contextCanvas.strokeStyle = this.mainColor;
        this.contextCanvas.shadowColor = this.mainColor;
        this.contextCanvas.shadowBlur = lightRadius;

        for (let i=0; i<this._traceArr.length; i++) {
            this.contextCanvas.lineTo(this._traceArr[i].x,this._traceArr[i].y);
            
            // if (this._traceArr.length > this.traceMaxLength-1) { // для того, чтобы начать обнаружение пересчения при добавлении всех элементов трасировки
                
                let sDX = this._traceArr[i].x - this.collision.x;
                let sDY = this._traceArr[i].y - this.collision.y;
                let selfLenght = Math.sqrt(sDX*sDX + sDY*sDY);

                let eDX = this._traceArr[i].x - this.enemy.collision.x;
                let eDY = this._traceArr[i].y - this.enemy.collision.y;
                let enemyLenght = Math.sqrt(eDX*eDX + eDY*eDY);

                let sumRadius = traceRadius + cycleRadius;
                
                if (selfLenght<sumRadius) {
                    this.isCollision  = true;

                    col = {
                        x: this.collision.x,
                        y: this.collision.y,
                        color: this.colorObject,
                    }

                }
                if (enemyLenght<sumRadius) {
                    this.enemy.isCollision  = true;

                    col = {
                        x: this.enemy.collision.x,
                        y: this.enemy.collision.y,
                        color: this.enemy.colorObject,
                    }

                }
            }
        // }
        this.contextCanvas.stroke();

        this.contextCanvas.shadowBlur = 0;
        this.contextCanvas.lineWidth = 1;

        if (this.isCollision ) {

            if (this.explosion == false) {
                addParticles(col);
                this.explosion = true;
            }
            for (let i = 0; i<50; i++) {
                particleArr[i].render();
            }
        }
    }
    drawCycle(offsetX, offsetY, scaleDecrease) {
        this.contextCanvas.drawImage(this._img, 
                                     offsetX, 
                                     offsetY, 
                                     this._img.width/scaleDecrease, 
                                     this._img.height/scaleDecrease);
    }
    drawWheels(x, y, densX, densY , width, height, lightRadius) {
        this.contextCanvas.fillStyle = this.mainColor;
        this.contextCanvas.shadowColor = this.mainColor;
        this.contextCanvas.shadowBlur = lightRadius;

        this.contextCanvas.fillRect(x - densX, y + densY,  width, height);
        this.contextCanvas.fillRect(x - densX, y - densY, width, height);
        this.contextCanvas.fillRect(x + densX, y + densY, width, height);
        this.contextCanvas.fillRect(x + densX, y - densY, width, height);
    }
    update() {
        if (this.explosion == false) {

            if (keyPress[this.keyControlls.TURN_LEFT] == true) {
                this._angle -= this.rotationSens;
            }
            if (keyPress[this.keyControlls.TURN_RIGHT] == true) {
                this._angle += this.rotationSens;
            }
            if (keyPress[this.keyControlls.FORWARD] == true) {
                this.x += Math.cos(this._rad) * this.maxSpeed;
                this.y += Math.sin(this._rad) * this.maxSpeed;
        
                this._traceArr.push( {x: this.x, y: this.y} );
                if (this._traceArr.length > this.traceMaxLength) {
                    this._traceArr.shift();
                }
            }
            if (keyPress[this.keyControlls.BACKWARD] == true) {
                this.x -= Math.cos(this._rad) * this.maxSpeed;
                this.y -= Math.sin(this._rad) * this.maxSpeed;
            }

        }

        let collisionOffset = 50;
        this.collision.x = this.x + collisionOffset * Math.cos(this._rad);
        this.collision.y = this.y + collisionOffset * Math.sin(this._rad);

        this._rad = this._angle*Math.PI/180;
    }
}

let optionsBlueCycle = {
    startPosition: setPoint(150, 500),
    startAngle: 0,
    mainColor:  { r: 111, g: 195, b: 223 },
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(38, 40, 37, 39),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let blueLightCycle = new LightCycle(optionsBlueCycle);

let optionsOrangeCycle = {
    startPosition: setPoint(1700, 500),
    startAngle: 180,
    mainColor: { r: 223, g: 116, b: 12 },
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(87, 83, 65, 68),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let orangeLightCycle = new LightCycle(optionsOrangeCycle);

blueLightCycle.setEnemy(orangeLightCycle);
orangeLightCycle.setEnemy(blueLightCycle);

let backgroundOptions = {
    pointsOffsetSpeed: 0.5,
    gridOffsetSpeed: 1,
    contextCanvas: ctx
}
let background = new Background(backgroundOptions);
background.setCameraTarget(blueLightCycle);




let myAnim = 0;
let isCollision = false;

class Particle {
    constructor(options) {
        let { x,
              y, 
              color,
              maxSpeed,
              maxSize,
              maxLife,
              deceleration,
              contextCanvas } = options;

        this.velX = x;
        this.velY = y;
        this.color = color;
        this.maxSpeed = maxSpeed; //2
        this.maxSize = maxSize; // 10
        this.maxLife = maxLife; // 5
        this.deceleration = 1 - deceleration; // 0.15
        this.contextCanvas = contextCanvas;

        // значения по умолчанию
        this.x = 0;
        this.y = 0;
        this.opacity = 1;
        this.size = random(0,this.maxSize);
        this.randomTheta = random(0, Math.PI * 2);
        this.speedXRandom = random(0, this.maxSpeed);
        this.speedYRandom = random(0, this.maxSpeed);
        this.position = setPoint(0,0);
    }
    render() {
        this.contextCanvas.save();
        this.contextCanvas.translate(this.velX,this.velY);
        this.contextCanvas.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.opacity})`;
        this.contextCanvas.fillRect(this.position.x,this.position.y, this.size,this.size);
        this.contextCanvas.restore();

        this.update();
    }
    update() {
        this.x += this.speedXRandom * Math.cos(this.randomTheta);
        this.y += this.speedYRandom * Math.sin(this.randomTheta);
    
        this.x *= this.deceleration;
        this.y *= this.deceleration;

        this.velX += this.x;
        this.velY += this.y;
        
        if (this.size > 0  || this.opacity > 0) {
            this.size -= 1.25 / this.maxLife;
            this.opacity -= 1.25 / (this.maxLife*5);
        }
    }
}

let particleOpstion = {
    x: 0,
    y: 0,
    color: "black",
    maxSpeed: 2,
    maxSize: 10,
    maxLife: 5,
    deceleration: 0.15,
    contextCanvas: ctx
}
let particleArr = (new Array(50).fill)(0);
function addParticles(col) {
    for (let i = 0; i<50; i++) {
        particleOpstion = {...particleOpstion, x: col.x, y: col.y, color: col.color};
        particleArr[i] = new Particle(particleOpstion);
    }
}

// class GameScene {
//     constructor() {

//         this.update = this.update.bind(this);
//     }
//     update() {
//         ctx.clearRect(0,0,playingField.width,playingField.height);
//         myAnim = requestAnimationFrame(this.update);
    
//         background.render();
//         blueLightCycle.render();
//         orangeLightCycle.render();
//     }
// }

class GameCore {
    constructor() {
        const background = new Background();
        const particle = new Particle();
        const orangeCycle = new LightCycle();
        const blueCycle = new LightCycle();

        this.gs = new GameScene(background, particle, orangeCycle, blueCycle);
        
        orangeCycle.timerStart();
        orangeCycle.addEventListener("boom", e => {
            this.gs.setState("GET_COLLISION");
        })
        orangeCycle.addEventListener("win", e => {
            this.gs.setState("SCORE_RESULT");
        })

        particle.addEventListener("complete", e => {
            this.gs.setState("RESET_POSITION");
        })
    }
    start() {
        this.gs.setState("START_SCREEN");
    }
}

class GameScene {
    constructor( background, particle, orangeCycle, blueCycle ) {
        this.background = background;
        this.particle = particle;
        this.orangeCycle = orangeCycle;
        this.blueCycle = blueCycle;

        this.update = this.update.bind(this);

        this.currentState = null;
    }
    setState(stateName) {
        switch (stateName) {
            case "START_SCREEN": {
                this.currentState = function() {
                    this.background.scrollCamera();
                    this.currentState;
                }
                break;
            }
            case "GAME_PREPARE": {
                this.currentState = function() {
                    this.background.render();
                    this.orangeCycle.setStartPosition();
                    this.blueCycle.setStartPosition();
                }
                break;
            }
            case "GET_COLLISION": {
                this.currentState = function() {
                    this.particle.explosion();
                }
                break;
            }
            case "RESET_POSITION": {
                this.currentState = function() {
                    this.orangeCycle.setStartPosition();
                    this.blueCycle.setStartPosition();
                }
                break;
            }
            case "SCORE_RESULT": {
                this.currentState = function() {

                }
                break;
            }
        } 
        this.update();
    }
    update() {
        requestAnimationFrame(this.update);
        // ctx.clearRect(0,0,900,900);
        this.currentState();
    }
}
