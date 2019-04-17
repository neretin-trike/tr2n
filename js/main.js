
let playingField = document.getElementById("playing_field");
playingField.width = window.innerWidth;
playingField.height = window.innerHeight;

let startGUIElem = document.querySelector(".start-gui");

let ctx = playingField.getContext("2d");

let keyPress = {};
document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

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
        let moveX = - this._target.x * this.pointsOffsetSpeed;
        let moveY = - this._target.y * this.pointsOffsetSpeed;
        this.drawPoints(25, 25, 50, true, moveX ,moveY);

        moveX = - this._target.x * this.gridOffsetSpeed;
        moveY = - this._target.y * this.gridOffsetSpeed;
        this.drawGrid(0, 0, 100, true, moveX, moveY);
    }
    scroll(stop) {
        this.moveX =  1;
        this.moveY -= 5;
        let bound = -200;
    
        if (this.moveY < bound ) {
            if (stop) {
                return true;
            }
            this.moveY = 0;
        };

        this.drawPoints(-50, -20, 50, true, this.moveX, this.moveY/2);
        this.drawGrid(-50, 10, 100, true, this.moveX, this.moveY);
    }
    drawPoints(offsetX, offsetY, freq, isTranslate, moveX, moveY) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate(moveX, moveY);
        }
        this.contextCanvas.fillStyle = "#2a3849";
        for (let i = 0; i< 4000/freq; i++) {
            for (let j = 0; j< 2000/freq; j++) {
                ctx.moveTo(offsetX + i*freq,j*freq + offsetY);
                ctx.arc(offsetX + i*freq,j*freq + offsetY, 1,0,Math.PI*2);
            }
        }
        this.contextCanvas.fill();
        this.contextCanvas.closePath();
        this.contextCanvas.restore();
    }
    drawGrid(offsetX, offsetY, freq, isTranslate, moveX, moveY) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate(moveX, moveY);
        }
        this.contextCanvas.strokeStyle = "#1e2f46";
        this.contextCanvas.lineWidth = 1;
        for (let i = 0; i<5000/freq; i++) {
            this.contextCanvas.moveTo(offsetX + i*freq, 0);
            this.contextCanvas.lineTo(offsetX + i*freq, 5000);

            this.contextCanvas.moveTo(0, i*freq + offsetY);
            this.contextCanvas.lineTo(5000, i*freq + offsetY);
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

        this.positionDefault = {startAngle,...startPosition};

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

        this._callbackList = {};
    }
    addEventListener(name, callback) {
        this._callbackList[name] = callback;
    }
    setEnemy(enemy) {
        this.enemy = enemy;
    }
    goReset() {
        // console.log(this.positionDefault);
        this.x = this.positionDefault.x;
        this.y = this.positionDefault.y;
        this._angle = this.positionDefault.startAngle;

        this.isCollision = false;
        this.explosion = false;
        this.a = 1;
        this._rad = 0;
        this._traceArr = [];
        this.collision = setPoint(0,0);

    }
    goStartPosition(offsetLenght) {
        if (this.x == offsetLenght ) {
            this._callbackList["start"]();
            return;
        } 

        this.x += Math.cos(this._rad) * 2;

        this._traceArr.push( {x: this.x, y: this.y} );
        if (this._traceArr.length > this.traceMaxLength) {
            this._traceArr.shift();
        }
    }
    render() {
        this.drawTrace(4, 10, 10);

        this.contextCanvas.save();
        this.contextCanvas.translate(this.x, this.y);
        this.contextCanvas.rotate(this._rad);

        if (this.isCollision ) {
            this.a += 2;
            this.drawCycle(-20, -20, this.a );

        } else {
            this.drawCycle(-20, -20, 2);
            this.drawWheels(16, -1, 24, 12, 12, 3, 10);
        }

        this.contextCanvas.restore();

        this.update();
    }
    drawTrace(traceRadius, cycleRadius, lightRadius) {
        this.contextCanvas.beginPath();

        this.contextCanvas.lineWidth = traceRadius;
        this.contextCanvas.strokeStyle = this.mainColor;
        this.contextCanvas.shadowColor = this.mainColor;
        this.contextCanvas.shadowBlur = lightRadius;

        let colData = {};

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
            }
            if (enemyLenght<sumRadius) {
                this.enemy.isCollision  = true;
            }
        }
        // }

        this.contextCanvas.stroke();

        this.contextCanvas.shadowBlur = 0;
        this.contextCanvas.lineWidth = 1;

        if (this.isCollision ) {
            if (this.explosion == false) {
                colData = {
                    x: this.collision.x,
                    y: this.collision.y,
                    color: this.colorObject,
                }
                
                this._callbackList["boom"](colData);
                this.explosion = true;
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


class ParticleSystem {
    constructor(options) {
        this.options = options;

        this.particleArr = [];
        this._callbackList = {};

        this.dieCount = 0;
    }
    addEventListener(name, callback) {
        this._callbackList[name] = callback;
    }
    createParticles(count, param) {
        for (let i = 0; i<count; i++) {
            this.particleArr[i] = new Particle( {...this.options, ...param});
        }
    }
    checkParticles(count) {
        if (this.dieCount >= count-1) {
            this._callbackList["complete"]();
            this.dieCount = 0;
            return;
        }
        for (let i = 0; i<count; i++) {
            if (this.particleArr[i].isDie) {
                this.dieCount++;
            }
        }
    }
}

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

        this.maxSpeed = maxSpeed; //2
        this.maxSize = maxSize; // 10
        this.maxLife = maxLife; // 5
        this.deceleration = 1 - deceleration; // 0.15
        this.contextCanvas = contextCanvas;

        this.velX = x;
        this.velY = y;
        this.color = color;

        // значения по умолчанию
        this.x = 0;
        this.y = 0;
        this.opacity = 1;
        this.size = random(0,this.maxSize);
        this.randomTheta = random(0, Math.PI * 2);
        this.speedXRandom = random(0, this.maxSpeed);
        this.speedYRandom = random(0, this.maxSpeed);
        this.position = setPoint(0,0);
        this.isDie = false;

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
        } else {
            this.isDie = true;
        }
    }
}


let blueCycleCycleOptions = {
    startPosition: setPoint(-80, playingField.height/2),
    startAngle: 0,
    mainColor:  { r: 111, g: 195, b: 223 },
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(38, 40, 37, 39),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let orangeCycleOptions = {
    startPosition: setPoint(playingField.width+80, playingField.height/2),
    startAngle: 180,
    mainColor: { r: 223, g: 116, b: 12 },
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(87, 83, 65, 68),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let backgroundOptions = {
    pointsOffsetSpeed: 0.5,
    gridOffsetSpeed: 1,
    contextCanvas: ctx
}
let particleOptions = {
    maxSpeed: 2,
    maxSize: 10,
    maxLife: 5,
    deceleration: 0.15,
    contextCanvas: ctx
}

class GameCore {
    constructor() {
        const background = new Background(backgroundOptions);
        const particleSystem = new ParticleSystem(particleOptions);
        const orangeCycle = new LightCycle(orangeCycleOptions);
        const blueCycle = new LightCycle(blueCycleCycleOptions);

        blueCycle.setEnemy(orangeCycle);
        orangeCycle.setEnemy(blueCycle);

        this.gs = new GameScene(background, particleSystem, orangeCycle, blueCycle);
        let that = this;


        blueCycle.addEventListener("start", e => {
            that.gs.setState("PLAYER_READY");
        })
        orangeCycle.addEventListener("start", e => {
            that.gs.setState("PLAYER_READY");
        })

        blueCycle.addEventListener("boom", e => {
            that.gs.setState("GET_COLLISION", e);
        })
        orangeCycle.addEventListener("boom", e => {
            that.gs.setState("GET_COLLISION", e);
        })

        blueCycle.addEventListener("win", e => {
            that.gs.setState("SCORE_RESULT");
        })
        orangeCycle.addEventListener("win", e => {
            that.gs.setState("SCORE_RESULT");
        })

        particleSystem.addEventListener("complete", e => {
            that.gs.setState("RESET_POSITION");
        })

        document.addEventListener ("keydown", e => {
            if (e.keyCode == 13) {
                that.gs.setState("GAME_PREPARE");
            }
        });
    }
    start() {
        this.gs.setState("START_SCREEN");
    }
}

class GameScene {
    constructor( background, particleSystem, orangeCycle, blueCycle ) {
        this.background = background;
        this.particleSystem = particleSystem;
        this.orangeCycle = orangeCycle;
        this.blueCycle = blueCycle;

        this.update = this.update.bind(this);

        this.currentState = null;
    }
    setState(stateName, param) {
        switch (stateName) {
            case "START_SCREEN": {
                this.currentState = function() {
                    this.background.scroll();
                }
                this.update();

                break;
            }
            case "GAME_PREPARE": {

                startGUIElem.style.opacity = "0"; 
                playingField.style.transform = "none";

                this.background.setCameraTarget({x:150, y:playingField.height/2});

                this.currentState = function() {
                    if (this.background.scroll(true) ) {
                        
                        this.background.render();

                        this.blueCycle.render();
                        this.blueCycle.goStartPosition(150);

                        this.orangeCycle.render();
                        this.orangeCycle.goStartPosition(playingField.width-150);
                    };
                }
                break;
            }
            case "PLAYER_READY" : {

                this.background.setCameraTarget(this.blueCycle);

                console.log(this.blueCycle.enemy);
                console.log(this.orangeCycle.enemy);

                this.currentState = function() {
                    this.background.render();

                    this.orangeCycle.render();
                    this.blueCycle.render();
                }
                break;
            }
            case "GET_COLLISION": {

                this.particleSystem.createParticles(50, {x: param.x, y: param.y, color: param.color})

                this.currentState = function() {
                    for (let i = 0; i<50; i++) {
                        this.particleSystem.particleArr[i].render();
                    }
                    this.particleSystem.checkParticles(50);

                    this.background.render();

                    this.orangeCycle.render();
                    this.blueCycle.render();
                }
                break;
            }
            case "RESET_POSITION": {
                this.blueCycle.goReset();
                this.orangeCycle.goReset();

                this.background.setCameraTarget(this.blueCycle);

                this.currentState = function() {
                    this.background.render();

                    this.blueCycle.render();
                    this.blueCycle.goStartPosition(150);

                    this.orangeCycle.render();
                    this.orangeCycle.goStartPosition(playingField.width-150);
                }
                break;
            }
            case "SCORE_RESULT": {
                this.currentState = function() {

                }
                break;
            }
        } 
    }
    update() {
        requestAnimationFrame(this.update);
        ctx.clearRect(0,0,playingField.width,playingField.height);
        this.currentState();
    }
}

const newGame = new GameCore();
newGame.start();