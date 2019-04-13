
let playingField = document.getElementById("playing_field");
playingField.width = window.innerWidth;
playingField.height = window.innerHeight;

let ctx = playingField.getContext("2d");

//let velX = 150;
//let velY = 150;
let keyPress = {};
let traceArr = [];



let colX = 0;
let colY = 0;

let itHit = false;

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

// let lightCycleColor = "#6fc3df";
let lightCycleColor = "#df740c";

class LightCycle {
    constructor(options) {
        let { startPosition,
             mainColor, 
             maxSpeed, 
             rotationSens, 
             keyControlls, 
             spriteSrc, 
             traceLength,
             contextCanvas} = options;

        this.x = startPosition.x;
        this.y = startPosition.y;
        this.mainColor = mainColor;
        this.maxSpeed = maxSpeed;
        this.rotationSens = rotationSens;
        this.keyControlls = keyControlls;
        this.traceLength = traceLength; 
        this.contextCanvas = contextCanvas;

        this._img = new Image();
        this._img.src = spriteSrc;
        this._angle = 0;
        this._rad = 0;
        this._collision = setPoint(0,0);
    }
    render() {
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
    
            // traceArr.push( {x: velX, y: velY} );
            // if (traceArr.length > 150) {
            //     traceArr.shift();
            // }
        }
        if (keyPress[this.keyControlls.BACKWARD] == true) {
            this.x -= Math.cos(this._rad)*this.maxSpeed;
            this.y -= Math.sin(this._rad)*this.maxSpeed;
        }

        this._collision.x = this.x + 50*Math.cos(this._rad);
        this._collision.y = this.y + 50*Math.cos(this._rad);

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
    traceLength: 150,
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
    traceLength: 150,
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


    // ctx.beginPath();
    // ctx.save();
    // ctx.translate(-velX*0.5,-velY*0.5);
    // ctx.fillStyle = "#2a3849";
    // for (let i = 0; i<80; i++) {
    //     for (let j = 0; j<40; j++) {
    //         ctx.moveTo(25+i*50,j*50+25);
    //         ctx.arc(25+i*50,j*50+25, 1,0,Math.PI*2);
    //     }
    // }
    // ctx.fill();
    // ctx.closePath();
    // ctx.restore();

    // ctx.beginPath();
    // ctx.save();
    // ctx.translate(-velX,-velY);
    // ctx.strokeStyle = "#1e2f46";
    // ctx.lineWidth = 1;
    // for (let i = 0; i<50; i++) {
    //     ctx.moveTo(i*100,0);
    //     ctx.lineTo(i*100,4000);

    //     ctx.moveTo(0,i*100);
    //     ctx.lineTo(4000, i*100);
    // }
    // ctx.stroke();
    // ctx.closePath();
    // ctx.restore();

    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = lightCycleColor;
    ctx.shadowColor = lightCycleColor;
    ctx.shadowBlur = 10;
    for (let i=0; i<traceArr.length; i++) {
      ctx.lineTo(traceArr[i].x,traceArr[i].y);

      if (traceArr.length > 148) {
        let AC = traceArr[i].x-colX;
        let BC = traceArr[i].y-colY;
        let lenght = Math.sqrt(AC*AC+BC*BC);
  
        let sumRadius = 4+10;

        if (lenght<sumRadius) {
            itHit = true;
        }
      }
    }
    ctx.stroke();

    blueLightCycle.render();
    orangeLightCycle.render();


    // ctx.beginPath();
    // ctx.shadowBlur = 0;
    // ctx.lineWidth = 1;
    // ctx.strokeStyle = "green";
    // ctx.arc(velX,velY,10,0,Math.PI*2);
    // ctx.stroke();
    // ctx.closePath();
  
    // ctx.save();
    // ctx.translate(velX,velY);
    // ctx.rotate(rad);
    // ctx.drawImage(img, -20,-20, 170/2, 82/2);

    // colX = velX+50*Math.cos(rad);
    // colY = velY+50*Math.sin(rad);

    // ctx.fillStyle = lightCycleColor;
    // ctx.shadowColor = lightCycleColor;
    // ctx.shadowBlur = 10;
    // ctx.fillRect(-9,11,12,3);
    // ctx.fillRect(-9,-13,12,3);
    // ctx.fillRect(41,11,12,3);
    // ctx.fillRect(41,-13,12,3);
    // ctx.restore();

    

    if (itHit) {
        console.log("ПРОИЗОШЛО ПЕРЕСЕЧЕНИЕ");
        cancelAnimationFrame(myAnim);
    }
    

    myAnim = requestAnimationFrame(Update);
}

Update();
