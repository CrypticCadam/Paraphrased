var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height= 480;
ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(50,50);
ctx.stroke();
ctx.beginPath();
ctx.arc(100,100,20,0,Math.PI); //x,y,radius,begin,end
ctx.stroke();
