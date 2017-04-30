var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height= 480;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(50,50);
ctx.stroke();
ctx.beginPath();
ctx.moveTo(100,100);
ctx.arc(100,100,20,Math.PI);
ctx.stroke();
