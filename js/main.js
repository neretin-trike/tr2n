
var wRatio = 0.999;
var hRatio = 0.999;

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

var img = new Image();
img.src = "images/light-cycle.png";
img.src = "images/light-cycle.png";
img.onload = function() {
    Update();
};

let colX = 0;
let colY = 0;

let itHit = false;

// let lightCycleColor = "#6fc3df";
let lightCycleColor = "#df740c";

let myAnim = 0;
document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

function Update() {
    myAnim = requestAnimationFrame(Update);

    if (keyPress[37] == true) {
    	angle -= 7;
    }
    if (keyPress[39] == true) {
    	angle += 7;
    }
    if (keyPress[38] == true) {
    	velX += Math.cos(rad)*5;
        velY += Math.sin(rad)*5;

        traceArr.push( {x: velX, y: velY} );
        if (traceArr.length > 150) {
            traceArr.shift();
        }
    }
    if (keyPress[40] == true) {
    	velX -= Math.cos(rad)*5;
        velY -= Math.sin(rad)*5;
    }

    ctx.clearRect(0,0,playingField.width,playingField.height);

    ctx.beginPath();
    ctx.save();
    ctx.translate(-velX*0.5,-velY*0.5);
    ctx.fillStyle = "#2a3849";
    for (let i = 0; i<80; i++) {
        for (let j = 0; j<40; j++) {
            ctx.moveTo(25+i*50,j*50+25);
            ctx.arc(25+i*50,j*50+25, 1,0,Math.PI*2);
        }
    }
    ctx.fill();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.save();
    ctx.translate(-velX,-velY);
    ctx.strokeStyle = "#1e2f46";
    ctx.lineWidth = 1;
    for (let i = 0; i<50; i++) {
        ctx.moveTo(i*100,0);
        ctx.lineTo(i*100,4000);

        ctx.moveTo(0,i*100);
        ctx.lineTo(4000, i*100);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

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

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "green";
    ctx.arc(velX,velY,10,0,Math.PI*2);
    ctx.stroke();
    ctx.closePath();
  
    ctx.save();
    ctx.translate(velX,velY);
    ctx.rotate(rad);
    ctx.drawImage(img, -20,-20, 170/2, 82/2);

    colX = velX+50*Math.cos(rad);
    colY = velY+50*Math.sin(rad);

    ctx.fillStyle = lightCycleColor;
    ctx.shadowColor = lightCycleColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(-9,11,12,3);
    ctx.fillRect(-9,-13,12,3);
    ctx.fillRect(41,11,12,3);
    ctx.fillRect(41,-13,12,3);
    ctx.restore();

    if (itHit) {
        console.log("ПРОИЗОШЛО ПЕРЕСЕЧЕНИЕ");
        cancelAnimationFrame(myAnim);
    }
    
    rad = angle*Math.PI/180;


}
