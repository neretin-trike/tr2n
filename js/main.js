let playingField = document.getElementById("playing_field");
let ctx = playingField.getContext("2d");

let x = 0;
let y = 0;
let velX = 0;
let velY = 0;
let maxSpeed = 20;
let friction = 0.98;
let keyPress = 0;

document.onkeydown = function (e) {
    keyPress = e.keyCode;
}
document.onkeyup = function (e) {
    keyPress = 0;
}

function Update() {
    requestAnimationFrame(Update);

    if (keyPress == 39) {
        if (velX < maxSpeed) {
            velX++;
        }
    }
    if (keyPress == 37) {
        if (velX > -maxSpeed) {
            velX--;
        }
    }

    velX *= friction;
    x += velX;

    ctx.clearRect(0,0,playingField.width,playingField.height); 
    ctx.fillStyle = "red";
    ctx.strokeStyle = "darkred";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(200+x,50);
    ctx.lineTo(200+x,100);
    ctx.lineTo(250+x,75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

Update();