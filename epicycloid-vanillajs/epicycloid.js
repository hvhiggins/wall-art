// based on https://editor.p5js.org/drawliphant/sketches/lrlHI7jd_ by David Oliphant 

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

let R = 70; //scale
let vars = {
  k:5/2,
  k2:2/3,
  p:2/3,
  h:1,
};
let backup = {
  k: 2.8534,
  k2: 0.8651,
  p: 0.7652,
  h: 0.0,
};
let targvars = {...vars};
let varspds = {
  k: 0.0003,
  k2: 0.0001,
  p: 0.0001,
  h: 0.001,
};
let k = 2.8335;//ratio of first two circles
let targk = k;
let k2 = 0.8651;//ratio of first to third
let targk2 = k2;
let p = 0.7652;//ratio of the paths?
let targp = p;
let cnt=0;
let h = 0;//distance of lever to point
let targh = h;
let spd = 0.0005;
let play = false;
let total_steps = 0;
let target_interval = 200;
let history = [];
let lastTarg;

function convertBase16(num) {
  return num < 10 ? num : num.toString(16)
}

// Copied from http://thecolourclock.com/
getHex = function() {
  var d = new Date()
  var milliseconds = d.getMilliseconds()
  var seconds = d.getSeconds()
  var minutes = d.getMinutes()
  var hours = d.getHours()
  var array = new Array()
  var calc = (hours + minutes / 60) / 24
  array[0] = convertBase16(Math.round(calc * 15))
  var calc2 = NaN
  if (hours >= 20) {
    calc2 = (hours + minutes / 60) / 4
  } else {
    calc2 = (hours + minutes / 60) / 10
  }
  var calc3 = Math.floor(calc2)
  array[1] = convertBase16(Math.round((calc2 - calc3) * 15))
  var calc4 = (minutes + seconds / 60) / 60
  array[2] = convertBase16(Math.round(calc4 * 15))
  var calc5 = (minutes + seconds / 60) / 10
  var calc6 = Math.floor(calc5)
  array[3] = convertBase16(Math.round((calc5 - calc6) * 15))
  var calc7 = (seconds + milliseconds / 1000) / 60
  array[4] = convertBase16(Math.round(calc7 * 15))
  var calc8 = (seconds + milliseconds / 1000) / 10
  var calc9 = Math.floor(calc8)
  array[5] = convertBase16(Math.round((calc8 - calc9) * 15))

  return '#' + array.join('');
}

function updateRandOne(v, vspd, mult) {
  return v+(Math.random()*2*vspd-vspd)*mult;
}
function updateRandAll() {
  if (!cnt){
    cnt=target_interval;
    history.push({...targvars});
    for (v in vars){
	  targvars[v]=updateRandOne(vars[v], varspds[v], 100);
    }
  }
  for (v in vars){
    vars[v]=vars[v]+(targvars[v]-vars[v])/cnt;
  }
  cnt-=1;
}

function historyStepBack(){
  if (lastTarg === undefined) lastTarg = history.pop();
  if (cnt<=target_interval){
    cnt+=1;
  } else {
    cnt = 0;
    lastTarg = history.pop();
  }
  for (v in vars){
    vars[v] = vars[v]+(lastTarg[v]-vars[v])/cnt;
  }
}

document.addEventListener('keydown', function(event) {
    switch(event.key){
        case 'h':
            historyStepBack();
            break;
        case 't': // t
            cnt=0;
            updateRandAll();
            break;
        case ' ': // spacebar
            play = !play;
            break;
        case 'a':
            vars.k+=varspds.k;
            targvars.k+=varspds.k;
            break;
        case 'q':
            vars.k-=varspds.k;
            targvars.k-=varspds.k;
            break;
        case 'w':
            vars.k2+=varspds.k2;
            targvars.k2+=varspds.k2;
            break;
        case 's':
            vars.k2-=varspds.k2;
            targvars.k2-=varspds.k2;
            break;
        case 'e':
            vars.p+=varspds.p;
            targvars.p+=varspds.p;
            break;
        case 'd':
            vars.p-=varspds.p;
            targvars.p-=varspds.p;
            break;
        case 'f':
            vars.h+=varspds.h;
            targvars.h+=varspds.h;
            break;
        case 'r':
            vars.h-=varspds.h;
            targvars.h-=varspds.h;
            break;
  }
})
var controlstext = [
    "Controls:",
    "Q,A: k, W,S: k2, E,D: p, R,F: h",
    "pause/play: <spacebar>",
    "reset targets: t",
    "Thanks to David Oliphant and Sort of School"]
    
    
let cos = Math.cos;
let sin = Math.sin;

let scale = (x,y) => [x + canvas.width/2, y+ canvas.height/2];

function draw() {
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(0.5, 0.5);

    color = getHex();
    ctx.strokeStyle = color;

    total_steps+=1;
    if (play) {updateRandAll()}
    
    ctx.fillStyle = 'red';
    ctx.font = '16px monospace';
    let ypos=30;
    sideTextLines = [];
    for (v in vars) {
        sideTextLines.push(`${v}: ${parseFloat(vars[v]).toPrecision(4)} | target ${v}: ${
        parseFloat(targvars[v]).toPrecision(4)}`);
    }
    sideTextLines.push("Animation counter: "+parseInt(cnt));
    sideTextLines.push(...controlstext);
    for (line of sideTextLines) {
        ctx.fillText(line ,10,ypos);
        ypos+=20;
    }
            
    ctx.beginPath();

    let r = R/vars.k;
    let r2 = R/vars.k2;
    let x = (R + r) * cos(0) + (r + r2) * cos(0 + (R*0)/r - R*0/(vars.p*r)) + R*vars.h * cos(0 + R*0/r - R*0/(vars.p*r) - R*0/(vars.p*r2));
    let y = (R + r) * sin(0) + (r + r2) * sin(0 + (R*0)/r - R*0/(vars.p*r)) + R*vars.h * sin(0 + R*0/r - R*0/(vars.p*r) - R*0/(vars.p*r2));
    ctx.moveTo(...scale(x,y))
    for(let t = 0; t<400;t+=0.01){//range and precision
        x = (R + r) * cos(t) + (r + r2) * cos(t + (R*t)/r - R*t/(vars.p*r)) + R * vars.h * cos(t + R*t/r - R*t/(vars.p*r) - R*t/(vars.p*r2));
        y = (R + r) * sin(t) + (r + r2) * sin(t + (R*t)/r - R*t/(vars.p*r)) + R * vars.h * sin(t + R*t/r - R*t/(vars.p*r) - R*t/(vars.p*r2));
        ctx.lineTo(...scale(x,y));
    }
    ctx.stroke()
}
setInterval(draw,30);
