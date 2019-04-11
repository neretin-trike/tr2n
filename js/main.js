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

document.onkeydown = function (e) {
    keyPress[e.keyCode] = true;
}
document.onkeyup = function (e) {
    keyPress[e.keyCode] = false;
}

function Update() {
    requestAnimationFrame(Update);

    if (keyPress[39]) {
        if (velX < maxSpeed) {
            velX+=coefSpeed;
        }
    }
    if (keyPress[37]) {
        if (velX > -maxSpeed) {
            velX-=coefSpeed;
        }
    }

    if (keyPress[40]) {
        if (velY < maxSpeed) {
            velY+=coefSpeed;
        }
    }
    if (keyPress[38]) {
        if (velY > -maxSpeed) {
            velY-=coefSpeed;
        }
    }

    velX *= friction;
    x += velX;

    velY *= friction;
    y += velY;

    ctx.clearRect(0,0,playingField.width,playingField.height); 
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(200+x,50+y);
    ctx.lineTo(200+x,100+y);
    ctx.lineTo(250+x,75+y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

Update();