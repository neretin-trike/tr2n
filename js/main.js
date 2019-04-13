
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
img.src = "images/blue-cycle.png";
img.onload = function() {
    Update();
};


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
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#6fc3df";
    ctx.shadowColor = "#6fc3df";
    ctx.shadowBlur = 10;
    for (let i=0; i<traceArr.length; i++) {
      ctx.lineTo(traceArr[i].x,traceArr[i].y);

      if (traceArr.length > 148 && i<145) {
        let AC = traceArr[i].x-velX;
        let BC = traceArr[i].y-velY;
        let lenght = Math.sqrt(AC*AC+BC*BC);
  
        let sumRadius = 4+10;

        if (lenght<sumRadius) {
            console.log("ПРОИЗОШЛО ПЕРЕСЕЧЕНИЕ");
            cancelAnimationFrame(myAnim);
        }
      }
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 1;
    ctx.strokeStyle="green";
    ctx.arc(velX,velY,10,0,Math.PI*2);
    ctx.stroke();
    ctx.closePath();
  
    ctx.save();
    ctx.translate(velX,velY);
    ctx.rotate(rad);
    ctx.drawImage(img, -20,-20, 170/2, 82/2);
    // ctx.strokeStyle="blue";
    // ctx.strokeRect(12,-5,15,10);
    ctx.restore();
    
    rad = angle*Math.PI/180;


}
