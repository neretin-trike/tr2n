
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
    }
    setCameraTarget(target) {
        this._target = target;
    }
    render() {
        this.drawPoints(25, 50, true);
        this.drawGrid(0, 100, true);
    }
    drawPoints(offset, freq, isTranslate) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate( - this._target.x * this.pointsOffsetSpeed, - this._target.y * this.pointsOffsetSpeed);
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
    drawGrid(offset, freq, isTranslate) {
        this.contextCanvas.beginPath();
        this.contextCanvas.save();
        if (isTranslate) {
            this.contextCanvas.translate( - this._target.x * this.gridOffsetSpeed, - this._target.y * this.gridOffsetSpeed);
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
              mainColor, 
              maxSpeed, 
              rotationSens, 
              keyControlls, 
              spriteSrc, 
              traceMaxLength,
              contextCanvas } = options;

        this.x = startPosition.x;
        this.y = startPosition.y;
        this.mainColor = mainColor;
        this.maxSpeed = maxSpeed;
        this.rotationSens = rotationSens;
        this.keyControlls = keyControlls;
        this.traceMaxLength = traceMaxLength; 
        this.contextCanvas = contextCanvas;


        this._img = new Image();
        this._img.src = spriteSrc;
        this._angle = 0;
        this._rad = 0;
        this._traceArr = [];
        this.collision = setPoint(0,0);

        this.isCollision = false;
        this.a = 1;
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
            this.a += 0.5;
            this.drawCycle(-20, -20, this.a );
            this.drawWheels(16, -1, 24/this.a, 12/this.a, 12, 3, 10);

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
            
            if (this._traceArr.length > this.traceMaxLength-1) { // для того, чтобы начать обнаружение пересчения при добавлении всех элементов трасировки
                
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
                        y: this.collision.y
                    }

                }
                if (enemyLenght<sumRadius) {
                    this.enemy.isCollision  = true;

                    col = {
                        x: this.enemy.collision.x,
                        y: this.enemy.collision.y
                    }

                }
            }
        }
        this.contextCanvas.stroke();

        this.contextCanvas.shadowBlur = 0;
        this.contextCanvas.lineWidth = 1;

        if (this.isCollision ) {
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

        let collisionLenght = 50;
        this.collision.x = this.x + collisionLenght * Math.cos(this._rad);
        this.collision.y = this.y + collisionLenght * Math.sin(this._rad);

        this._rad = this._angle*Math.PI/180;
    }
}

let optionsBlueCycle = {
    startPosition: setPoint(150, 150),
    mainColor: "rgb(111,195,223)",
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(38, 40, 37, 39),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let blueLightCycle = new LightCycle(optionsBlueCycle);

let optionsOrangeCycle = {
    startPosition: setPoint(150, 500),
    mainColor: "rgb(223,116,12)",
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



function random(min, max) {
    return min + Math.random() * (max - min);
}


let myAnim = 0;
let isCollision = false;

class Particle {
    constructor(x, y, color) {
        this.x = 0;
        this.y = 0;
        this.velX = 0;
        this.velY = 0;
        this.size = random(15,20);
        this.opacity = 1;

        this.maxSpeed = 2;
        this.randomTheta = random(0, Math.PI * 2);

        this.color = color;
        this.position = {
            x, y
        }
    }
    render() {
        ctx.save();
        ctx.translate(this.velX,this.velY);
        ctx.fillStyle = "rgba(223,116,12,"+ this.opacity +")";
        ctx.fillRect(this.position.x,this.position.y, this.size,this.size);
        ctx.restore();

        this.update();
    }
    update() {
        this.x += random(0, this.maxSpeed) * Math.cos(this.randomTheta);
        this.y += random(0, this.maxSpeed) * Math.sin(this.randomTheta);
    
        this.velX += this.x;
        this.velY += this.y;
    
        this.x *= 1-0.017;
        this.y *= 1-0.017;
    
        this.size -= 1;
        this.opacity -= 0.045;
    }
}

let particleArr = (new Array(50).fill)(0);
function addParticles(col) {
    for (let i = 0; i<50; i++) {
        particleArr[i] = new Particle(700, 700);
    }
}
addParticles(col);

function Update() {
    ctx.clearRect(0,0,playingField.width,playingField.height);
    myAnim = requestAnimationFrame(Update);

    background.render();

    blueLightCycle.render();
    orangeLightCycle.render();


    if (isCollision) {

        //cancelAnimationFrame(myAnim);
    }
}
Update();
