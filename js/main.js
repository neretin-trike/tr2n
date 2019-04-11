let playingField = document.getElementById("playing_field");
let ctx = playingField.getContext("2d");

let x = 0;
let y = 0;
let velX = 0;
let velY = 0;
let maxSpeed = 10;
let coefSpeed = 4;
let friction = 0.78;
let keyPress = {};
let angle = 0;

document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

function Update() {
    requestAnimationFrame(Update);

    if (keyPress[38]) {
        velX+=10;
        velY+=10;
        // if (velX < maxSpeed) {
        //     velX+=coefSpeed;
        // }
    }
    if (keyPress[40]) {
        velX-=10;
        velY-=10;
        // if (velX > -maxSpeed) {
        //     velX-=coefSpeed;
        // }
    }

    if (keyPress[39]) {
        angle+=3;
        // if (velY < maxSpeed) {
        //     velY+=coefSpeed;
        // }
    }
    if (keyPress[37]) {
        angle-=3;
        // if (velY > -maxSpeed) {
        //     velY-=coefSpeed;
        // }
    }

    // velX *= friction;
    // x += velX;

    // velY *= friction;
    // y += velY;


    let rad = angle*Math.PI/180;

    x = Math.cos(rad)*velX;
    y = Math.sin(rad)*velY;
    
    ctx.clearRect(0,0,playingField.width,playingField.height); 
    ctx.beginPath();
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rad);
    // ctx.fillStyle = "red";
    // ctx.strokeStyle = "darkred";
    // ctx.lineWidth = 5;
    ctx.moveTo(25,0);
    ctx.lineTo(25,30);
    ctx.lineTo(75,15);
    // ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

Update();