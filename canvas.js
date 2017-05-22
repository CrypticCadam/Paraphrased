`use strict`;
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

let ptConvert = {"px":1,"pt":4/3,"mm":480/127,"em":16,"cm":4800/127,"in":96};
function getFontSize(ctx){
	var [,size,type] = (ctx.font).match(/^(\d+)([a-z][a-z])/);
	return size*ptConvert[type];
}
function textWrap(ctx,text,maxWidth) {
	var lines=[];
	while(text.length>0){
		let i=text.length;
		while(ctx.measureText(text.slice(0,i)).width > maxWidth){i--}
		let str = text.slice(0,i);
		if(i<text.length){
			i = (str.lastIndexOf(" ")+1) || i;
		}
		i = (str.indexOf("\n")+1) || i;
		lines.push(str.slice(0,i).trim());
		text = text.slice(i).trim();
	}
	return lines;
}
let buttons={};
function makeButton(name,x,y,w,h,text){ //x,y is top left
	buttons[name] = {x:x,y:y,w:w,h:h,cursor:"pointer"};
	let lines = textWrap(ctx2,text||"",w*0.9);
	let offset = getFontSize(ctx2),
		amount = lines.length,
		centreX= x+w/2,
		initial= y+(h-(amount-1)*offset)/2;
	ctx2.textAlign = "center";
	ctx2.textBaseline = "middle";
	for(let i=0;i<amount;i++){ //Text wrapping is pretty damn good
		ctx2.fillText(lines[i],centreX,initial+offset*i);
	}
	return name;
}
function makeHotlink(name,x,y,text){
	let w = ctx2.measureText(text).width,
		h = getFontSize(ctx2);
	buttons[name]={name:name,x:x-w/2,y:y-h/2,w:w,h:h,cursor:"pointer"};
	ctx2.textAlign = "center";
	ctx2.textBaseline = "middle";
	ctx2.fillText(text,x,y);
	return name;
}

function getMousePos(e){
	return {x:e.pageX-13, y:e.pageY-126};
}
function isInside(x,y,rect){
	return (x>=rect.x)&&(x<=rect.x+rect.w)&&(y>=rect.y)&&(y<=rect.y+rect.h);
}
canvas2.addEventListener('click',function(e){
	e.preventDefault();
	e.stopPropagation();
	let {x,y} = getMousePos(e);
	var names = [];
	for(let b in buttons){
		let butt = buttons[b];
		if(isInside(x,y,butt)&&butt.click){
			butt.click(e,x,y);
		}
	}
},false);
canvas2.addEventListener('mousemove',function(e){
	e.preventDefault();
	e.stopPropagation();
	let {x,y} = getMousePos(e);
	let names = [];
	let cursor = "default";
	for(let b in buttons){
		let butt = buttons[b];
		if(isInside(x,y,butt)){
			if(!butt.entered && butt.enter){
				butt.enter(e,x,y)
			}
			butt.entered = true;
			cursor = butt.cursor;
			if(butt.move){butt.move(e,x,y)}
		}else if(butt.entered && butt.leave){
			butt.entered = false;
			butt.leave(e,x,y);
		}
	}
	canvas2.style.cursor = cursor;
},false);
canvas2.addEventListener('mousedown',function(e){
	e.preventDefault();
	e.stopPropagation();
	let {x,y} = getMousePos(e);
	var names = [];
	for(let b in buttons){
		let butt = buttons[b];
		if(isInside(x,y,butt) && butt.down){
			butt.down(e,x,y);
		}
	}
},false);
canvas2.addEventListener('mouseup',function(e){
	e.preventDefault();
	e.stopPropagation();
	let {x,y} = getMousePos(e);
	var names = [];
	for(let b in buttons){
		let butt = buttons[b];
		if(isInside(x,y,butt) && butt.up){
			butt.up(e,x,y);
		}
	}
},false);
canvas2.addEventListener('contextmenu',function(e){
	e.preventDefault();
	e.stopPropagation();
	let {x,y} = getMousePos(e);
	var names = [];
	for(let b in buttons){
		let butt = buttons[b];
		if(isInside(x,y,butt) && butt.rightClick){
			butt.rightClick(e,x,y);
		}
	}
},false);

function fillTextWrap(ctx,text,x,y,w){
	var lines = textWrap(ctx,text,w),
		offset= getFontSize(ctx);
	for(let i=0,len=lines.length;i<len;i++){
		ctx2.fillText(lines[i],x,y+offset*i);
	}
}

let buttonRow = [];
function addButton(click,text){
	let name = buttonRow.length;
	ctx2.fillStyle = "pink";
	ctx2.fillRect(10+buttonRow.length*100,300,80,40);
	ctx2.fillStyle = "black";
	makeButton(name,10+buttonRow.length*100,300,80,40,text);
	buttonRow.push(buttons[name]);
	buttons[name].click = click;
}
function remButton(n){
	delete buttons[buttonRow[n || buttonRow.length-1]];
	buttonRow.splice(n,1);
	if(n < buttonRow.length-1){
		for(let len=buttonRow.length; n<len; n++){
			buttons[buttonRow[n]].x -= 100;
		}
	}
}
function clearButtonRow(){
	for(let i=0,len=buttonRow.length; i<len; i++){
		console.log(delete buttons[i]);
	}
	buttonRow = [];
}
function drawMetaButtons(){
	ctx2.fillStyle = "crimson";
	ctx2.fillRect(000,000,40,20);
	ctx2.fillRect(000,430,40,20);
	ctx2.fillRect(760,430,40,20);
	ctx2.fillStyle = "black";
	ctx2.fillText("Menu",20,10);
	ctx2.fillText("Self",20,440);
	ctx2.fillText("Items",780,440);
}
function transition(){
	ctx2.beginPath()
	ctx2.clearRect(0,0,canvas2.width,canvas2.height);
	clearButtonRow(0);
	clearButtonRow(1);
	clearButtonRow(2);
	drawMetaButtons();
}
function textWallShit(){
	ctx2.font = "16px Georgia";
	ctx2.textAlign = "start";
	ctx2.textBaseline = "alphabetic";
}

let tempVars = {};
let newState = "start";
let vars = {
	name: "asshole",
	money: 10000,
	inventory: {
		WEAPON: "",
		ARMOUR: ""
	},
	storage: {},
	state: "",
};
function gameloop(time){
	if(newState){
		vars.state = newState;
		newState = "";
	}
	switch(vars.state){
		case "idle":
			break;
		case "start":
			transition();
			textWallShit();
			fillTextWrap(ctx2,
			   `Welcome to the world of suck.`,20,35,600);
			addButton(function(e,x,y){
				newState = "start1";
			},"Okay");
			break;
		case "start1":
			transition();
			textWallShit();
			fillTextWrap(ctx2,"Welcome to suck. Again. Customise yourself.",20,35,680);
			addButton(function(e,x,y){
				newState = "start2";
			},"Done");
			break;
		case "start2":
			transition();
			textWallShit();
			fillTextWrap(ctx2,"You are in the middle of your home town. To the north is the merchant area, and to the east is the guild district. Up west are the residents' houses, including yours. Down south is where the kinks happen.",20,35,680);
			addButton(function(e,x,y){
				newState = "house";
			},"House (<)");
			addButton(function(e,x,y){
				newState = "shops";
			},"Shops (^)");
			addButton(function(e,x,y){
				newState = "kinks";
			},"Kinks (v)");
			addButton(function(e,x,y){
				newState = "guild";
			},"Guild (>)");
			addButton(function(e,x,y){
				newState = "adventure";
			},"ADVENTURE");
			break;
		case "house":
			transition();
			textWallShit();
			fillTextWrap(ctx2,"This is your house. You already know what it looks like. You've lived in it for most of your life.",20,35,680)
			addButton(function(e,x,y){
				newState = "start2";
			},"Town");
			break;
		case "shops":
			transition();
			textWallShit();
			fillTextWrap(ctx2,"There's an arms & armours shop, a food shop, a slave auction, some banks, and a \"toys\" shop.",20,35,680)
			addButton(function(e,x,y){
				newState = "SHOP";
			},"Arms (<<)");
			addButton(function(e,x,y){
				newState = "SHOP";
			},"Foods (<)");
			addButton(function(e,x,y){
				newState = "";
			},"Slave (^)");
			addButton(function(e,x,y){
				newState = "";
			},"Banks (>)");
			addButton(function(e,x,y){
				newState = "SHOP";
			},"Toys (>>)");
			addButton(function(e,x,y){
				newState = "start2";
			},"Back (v)");
			break;
		case "adventure":
			transition();
			textWallShit();
			fillTextWrap(ctx2,"Scrapped. There was exploring, battles, mapping, and a bunch of other shit and I fucked it all up beyond repair.",20,35,680);
			addButton(function(e,x,y){
				newState = "start2";
			},"...");
			break;
		default:
			transition();
			textWallShit();
			fillTextWrap(ctx2,"You little shit, why'd you have to break it.",20,35,680);
			addButton(function(e,x,y){
				newState = "start2";
			},"...");
			break;
			
	}
	vars.state = "idle";
	
	requestAnimationFrame(gameloop);
}
requestAnimationFrame(gameloop);
