window.requestAnimFrame = (function(){ 
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){ 
              window.setTimeout(callback, 1000 / 60); 
            }; 
  })();

let playingField = document.getElementById("playing_field");

let ctx = playingField.getContext("2d");

drawTriangle();

document.onkeydown = function (e) {
    if (e.keyCode == 39) {
        drawTriangle(5);
    } 
    if (e.keyCode == 37) {
        drawTriangle(-5);
    }
}

function drawTriangle(x) {
    ctx.clearRect(0,0,playingField.width,playingField.height); 
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(200,50);
    ctx.lineTo(200,100);
    ctx.lineTo(250,75);
    ctx.closePath();
    ctx.strokeStyle = "darkred";
    ctx.lineWidth = 5;
    ctx.fill();
    ctx.stroke();
    ctx.translate(x,0);
}