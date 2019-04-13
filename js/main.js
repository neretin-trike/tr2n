
let playingField = document.getElementById("playing_field");
playingField.width = window.innerWidth;
playingField.height = window.innerHeight;

let ctx = playingField.getContext("2d");

let keyPress = {};

let isCollision = false;

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

class LightCycle {
    constructor(options, enemy) {
        let { startPosition,
             mainColor, 
             maxSpeed, 
             rotationSens, 
             keyControlls, 
             spriteSrc, 
             traceMaxLength,
             contextCanvas} = options;

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
        this.collision = setPoint(0,0);
        this._traceArr = [];
    }
    setEnemy(enemy) {
        this.enemy = enemy;
    }
    render() {
        this.drawTrace(4, 10, 10);
  
        this.contextCanvas.save();
        this.contextCanvas.translate(this.x, this.y);
        this.contextCanvas.rotate(this._rad);

        this.drawCycle(-20, -20, 2);
        this.drawWheels(16, -1, 24, 12, 12, 3, 10);

        this.contextCanvas.restore();

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
                
                if (selfLenght<sumRadius || enemyLenght<sumRadius) {
                    console.log("ПРОИЗОШЛО ПЕРЕСЕЧЕНИЕ");
                    isCollision = true;
                }
            }
        }
        this.contextCanvas.stroke();

        this.contextCanvas.shadowBlur = 0;
        this.contextCanvas.lineWidth = 1;
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
    mainColor: "#df740c",
    maxSpeed: 5,
    rotationSens: 7,
    keyControlls: bindKeyControlls(38, 40, 37, 39),
    spriteSrc:"images/light-cycle.png",
    traceMaxLength: 150,
    contextCanvas: ctx
}
let blueLightCycle = new LightCycle(optionsBlueCycle);

let optionsOrangeCycle = {
    startPosition: setPoint(500, 500),
    mainColor: "#6fc3df",
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

let myAnim = 0;
document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

function Update() {
    ctx.clearRect(0,0,playingField.width,playingField.height);

    myAnim = requestAnimationFrame(Update);

    // if (keyPress[37] == true) {
    // 	angle -= 7;
    // }
    // if (keyPress[39] == true) {
    // 	angle += 7;
    // }
    // if (keyPress[38] == true) {
    // 	velX += Math.cos(rad)*5;
    //     velY += Math.sin(rad)*5;

    //     traceArr.push( {x: velX, y: velY} );
    //     if (traceArr.length > 150) {
    //         traceArr.shift();
    //     }
    // }
    // if (keyPress[40] == true) {
    // 	velX -= Math.cos(rad)*5;
    //     velY -= Math.sin(rad)*5;
    // }

    blueLightCycle.render();
    orangeLightCycle.render();

    if (isCollision) {
        console.log("КАВО НЕ СЛЫШУ");
        cancelAnimationFrame(myAnim);
    }
}

Update();
