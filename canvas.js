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

//Lost my code twice. FML.

//Welp, here's a canvas button. Kill me.
let buttons={};
function addRectButton(name,x,y,w,h,z,func,style,text){
    var oldStyle = ctx2.fillStyle;
    ctx2.fillStyle = style || ctx2.fillStyle;
    ctx2.fillRect(x,y,w,h);
    ctx2.fillStyle = oldStyle;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(text || "",x+w/2,y+h/2);
    buttons[name]=[x,y,w,h,z || 0,func,false];
    return name;
}

function getMousePos(e) {
    var rect = canvas2.getBoundingClientRect();
    return [e.clientX-rect.left,
            e.clientY-rect.top];
}
function isInside(x,y,shape,round){
    if(round){
	    return (x-shape[0])**2+(y-shape[1])**2 <= shape[2]**2;
    }
    return x>=shape[0] && x<=shape[0]+shape[2] && y>=shape[1] && y<=shape[1]+shape[3] ;
}
canvas2.addEventListener('click',function(e){
    var [x,y] = getMousePos(e); //This is how you get multiple variables from one function
    var funcs = [],z = Number.NEGATIVE_INFINITY; // -INFINITY is always less than everything else
    for(let b in buttons){
        if(isInside(x,y,buttons[b])){ //If button has priority and is also being clicked on
            if(buttons[b][4]>z){
                funcs=[buttons[b][5]]; //Higher priority happens and nothing else does
            }else if(buttons[b][4]==z){
                funcs.push(buttons[b][5]); //If buttons share a priority, they both activate.
            }
        }
    }
    for(let i=0;i<funcs.length;i++){
        funcs[i]();
    }
},false);


let state="testing";
function gameloop(time){
    switch(state){
        case "testing":
            
            state="setup";
            break;
        case "setup":
            ctx2.font = "16pxGeorgia"
            ctx2.fillText("Testing, testing, 123",20,100);
            addRectButton("test",50,300,100,50,0,function(){
                delete buttons.test;
                ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                ctx2.fillText("Oh my god I made a button do a thing, so coooool.",20,100);
                setTimeout(function(){
                    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                    state = "menu init";
                },4000);
            },"0x000FFF","Button");
            addRectButton("othertest",175,300,100,50,0,function(){
                delete buttons.othertest;
                ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                ctx2.fillText("MOAR THINGS",20,100);
                setTimeout(function(){
                    ctx2.clearRect(0,0,canvas2.width,canvas2.height);
                    state = "menu init";
                },4000);
            },"0xFFF000","Other Button");
            state="menu loop";
            break;
        case "menu loop":
            // We just kinda wait here until a button makes something happen
            
            // This kind of setup is usually used for realtime games, rather than button-action games.
            // But realtime might be added later for whatever reason (MINIGAMES), so let's do it like this
            break;
        default:
            // Something fuckin' broke
    }
    
    requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);
