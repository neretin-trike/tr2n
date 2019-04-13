
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
    constructor(options) {
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
        this._collision = setPoint(0,0);
        this._traceArr = [];
    }
    render() {
        this.drawTrace();

        this.contextCanvas.beginPath();
        this.contextCanvas.shadowBlur = 0;
        this.contextCanvas.lineWidth = 1;
        this.contextCanvas.strokeStyle = "green";
        this.contextCanvas.arc(this.x, this.y, 10, 0, Math.PI*2);
        this.contextCanvas.stroke();
        this.contextCanvas.closePath();
      
        this.contextCanvas.save();
        this.contextCanvas.translate(this.x, this.y);
        this.contextCanvas.rotate(this._rad);
        this.contextCanvas.drawImage(this._img, -20,-20, 170/2, 82/2);
    
        this.contextCanvas.fillStyle = this.mainColor;
        this.contextCanvas.shadowColor = this.mainColor;
        this.contextCanvas.shadowBlur = 10;
        this.contextCanvas.fillRect(-9,11,12,3);
        this.contextCanvas.fillRect(-9,-13,12,3);
        this.contextCanvas.fillRect(41,11,12,3);
        this.contextCanvas.fillRect(41,-13,12,3);
        this.contextCanvas.restore();

        function drawWheels() {

        }

        this.update();
    }
    drawTrace() {
        this.contextCanvas.beginPath();
        this.contextCanvas.lineWidth = 4;
        this.contextCanvas.strokeStyle = this.mainColor;
        this.contextCanvas.shadowColor = this.mainColor;
        this.contextCanvas.shadowBlur = 10;
        for (let i=0; i<this._traceArr.length; i++) {

            this.contextCanvas.lineTo(this._traceArr[i].x,this._traceArr[i].y);
    
          if (this._traceArr.length > 148) {
            let dX = this._traceArr[i].x-this._collision.x;
            let dY = this._traceArr[i].y-this._collision.y;
            let lenght = Math.sqrt(dX*dX+dY*dY);
      
            let sumRadius = 4+10;
    
            if (lenght<sumRadius) {
                console.log("ПРОИЗОШЛО ПЕРЕСЕЧЕНИЕ");
                isCollision = true;
            }
          }
        }
        this.contextCanvas.stroke();
    }
    update() {
        if (keyPress[this.keyControlls.TURN_LEFT] == true) {
            this._angle -= 7;
        }
        if (keyPress[this.keyControlls.TURN_RIGHT] == true) {
            this._angle += 7;
        }
        if (keyPress[this.keyControlls.FORWARD] == true) {
            this.x += Math.cos(this._rad)*this.maxSpeed;
            this.y += Math.sin(this._rad)*this.maxSpeed;
    
            this._traceArr.push( {x: this.x, y: this.y} );
            if (this._traceArr.length > this.traceMaxLength) {
                this._traceArr.shift();
            }
        }
        if (keyPress[this.keyControlls.BACKWARD] == true) {
            this.x -= Math.cos(this._rad)*this.maxSpeed;
            this.y -= Math.sin(this._rad)*this.maxSpeed;
        }

        this._collision.x = this.x + 50*Math.cos(this._rad);
        this._collision.y = this.y + 50*Math.sin(this._rad);

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
    // orangeLightCycle.render();

    if (isCollision) {
        console.log("КАВО НЕ СЛЫШУ");
        cancelAnimationFrame(myAnim);
    }
}

Update();
