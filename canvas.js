`use strict`
var canvas0 = document.getElementById('canvas0'),
    canvas1 = document.getElementById('canvas1'),
    canvas2 = document.getElementById('canvas2'),
    ctx0 = canvas0.getContext('2d'),
    ctx1 = canvas1.getContext('2d'),
    ctx2 = canvas2.getContext('2d');
canvas0.width = 800;
canvas0.height= 450;
canvas1.width = 800;
canvas1.height= 450;
canvas2.width = 800;
canvas2.height= 450;

//Times lost everything: 3
//Times hating own life: 3
//Times wondering how all this even works: (Too many to count!)


//Logic
let buttons={};
function addRectButton(name,x,y,w,h,z,func,text){
    ctx2.textAlign = "center"; //These make it so the centre of any text is used for location instead of the corner
    ctx2.textBaseline = "middle";
    ctx2.fillText(text || "",x+w/2,y+h/2); //Put the text in the middle of the button
    buttons[name]={x:x,y:y,w:w,h:h,z:z,func:func}; //Add the button to the list of buttons
    return name;
}
let ptConvert = {"pt":1,"px":0.75};
function measureTextHeight(text){ //Gets rendered height of text in pixels. Trust me, it works.
    var [size,type] = text.match(/^(\d+)([a-z][a-z])/)
    return size*ptConvert[type];
}
function addHotlink(name,x,y,z,func,text){
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(text,x,y);
    let w = ctx2.measureText(text),
        h = measureTextHeight(ctx2,text);
    buttons[name]={x:x,y:y,w:w,h:h,z:z,func:func};
    return name;
}

function getMousePos(e){ //If we don't do this, we won't get the correct coords for mouse clicks
    var rect = canvas2.getBoundingClientRect();
    return {x : e.clientX-rect.left,
            y : e.clientY-rect.top};
}
function isInside(x,y,shape){
    if(shape.r){
        return (x-shape.x)**2+(y-shape.y)**2 <= shape.r**2; //Point in circle
    }
    return x>=shape.x && x<=shape.x+shape.w && y>=shape.y && y<=shape.y+shape.h; //Point in rectangle
}
canvas2.addEventListener('click',function(e){ //This function is ran whenever somebody clicks on canvas2
    var pos = getMousePos(e); //This is how you get multiple variables from one function
    var funcs = [],z = Number.NEGATIVE_INFINITY; // -INFINITY is always less than everything else
    for(let b in buttons){ //For everything in `buttons`, do this
        if(isInside(pos.x,pos.y,buttons[b])){ //If the mouse is inside this button
            if(buttons[b].z>z){ //If button has higher priority, it runs
                funcs=[buttons[b].func];
            }else if(buttons[b].z==z){ //If buttons share a priority, they all activate.
                funcs.push(buttons[b].func);
            }
        }
    }
    for(let i=0;i<funcs.length;i++){ //Iterate through `funcs`
        funcs[i](); //Run whatever's there
    }
},false);


//graphics
function drawRoundRect(ctx,x,y,w,h,r,filled){
    if(!(radius >= 0)){ //If radius isn't a number greater than 0
        radius = 5; //Default value
    }
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
    if(filled){ctx.fill();}
    else{ctx.stroke();}
}


//Doing shit
let state="setup"; 
function gameloop(time){
    switch(state){ //Runs the code under the case that matches `state`
        case "setup":
            ctx2.font = "16px Georgia"
            ctx2.textAlign = "start"; //Gotta make sure the text is oriented right
            ctx2.textBaseline = "alphabetic";
            ctx2.fillText("Testing, testing, 123",20,100);
            addRectButton("test",50,300,100,50,0,function(){ //This function is ran if this button is clicked
                buttons={};
                ctx2.clearRect(0,0,canvas2.width,canvas2.height);//Clear everything
                ctx2.textAlign = "start"; //Get me some alignment up in here
                ctx2.textBaseline = "alphabetic";
                ctx2.fillText("Oh my god I made a button do a thing, so coooool.",20,100);
                setTimeout(function(){ //After 4000 milliseconds (4 seconds), this will happen
                    ctx2.clearRect(0,0,canvas2.width,canvas2.height); //Clear it
                    state = "setup"; //Return to the setup
                },4000);
            },"#000FFF","Button");
            addRectButton("othertest",175,300,100,50,0,function(){
                buttons={};
                ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                ctx2.textAlign = "start";
                ctx2.textBaseline = "alphabetic";
                ctx2.fillText("MOAR THINGS",20,100);
                setTimeout(function(){
                    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                    state = "setup";
                },4000);
            },"#FFF000","Other Button");
            state="menu loop";
            break;
        case "menu loop":
            // We just kinda wait here until a button makes something happen
            
            // This kind of setup is usually used for realtime games, rather than button-action games.
            // But realtime might be added later for whatever reason (MINIGAMES), so let's do it like this
            break;
        default:
            // Should never get here, and if it does, something broke
    }
    
    requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);
