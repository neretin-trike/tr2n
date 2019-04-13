
var wRatio = 0.99;
var hRatio = 0.99;

let playingField = document.getElementById("playing_field");

playingField.width = window.innerWidth * wRatio;
playingField.height = window.innerHeight * hRatio;

let ctx = playingField.getContext("2d");

let x = 0;
let y = 0;
let velX = 150;
let velY = 150;
let maxSpeed = 10;
let coefSpeed = 4;
let friction = 0.78;
let keyPress = {};
let angle = 0;
let rad = 0;
let traceArr = [];

document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

function Update() {
    requestAnimationFrame(Update);

    if (keyPress[37] == true) {
    	angle-=7;
    }
    if (keyPress[39] == true) {
    	angle+=7;
    }
    if (keyPress[38] == true) {
    	velX += Math.cos(rad)*5;
        velY += Math.sin(rad)*5;

        if (traceArr.length < 150) {
            traceArr.push( {x: velX, y: velY} );
        } else {
            traceArr.shift();
        }
    }
    if (keyPress[40] == true) {
    	velX -= Math.cos(rad)*5;
        velY -= Math.sin(rad)*5;
    }

    ctx.clearRect(0,0,playingField.width,playingField.height);

    ctx.beginPath();
    ctx.strokeStyle="red";
    for (let i=0; i<traceArr.length; i++) {
      ctx.arc(traceArr[i].x,traceArr[i].y,2.5,0,Math.PI*2);
    }
    ctx.shadowColor = "red";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0; 
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;  
    ctx.strokeStyle="green";
    ctx.arc(velX,velY,10,0,Math.PI*2);
    ctx.stroke();
    ctx.closePath();
  
    ctx.save();
    ctx.translate(velX,velY);
    ctx.rotate(rad);
    ctx.strokeStyle="blue";
    ctx.strokeRect(-15/2+20,-10/2,15,10);
    ctx.restore();
    
    rad = angle*Math.PI/180;
}

Update();