let R = 110;//scale
let vars = {
  k: 2.8534,
  k2: 0.8651,
  p: 0.7652,
  h: 170.0,
}
let targvars = {...vars};
let varspds = {
  k: 0.005,
  k2: 0.002,
  p: 0.0005,
  h: 1,
}
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
let play = true;
let total_steps = 0;
let target_interval = 200;
let history = [];
let lastTarg; 
function setup() {
  createCanvas(screen.width,screen.height);
  stroke(255,0,0);
  fill(255,0,0);
  frameRate(24);
  textFont('Courier New');
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

function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs); 
}
function draw() {
  total_steps+=1;
  if (play) {updateRandAll()}
  background(0);
  text("Controls: Q,A: k, W,S: k2, E,D: p, R,F: h, pause/play: <spacebar>, reset targets: t",10,10);
  let ypos=30;
  for (v in vars) {
    text(v+": "+parseFloat(vars[v]).toPrecision(4)+" | target "+v+": "+parseFloat(targvars[v]).toPrecision(4),10,ypos);
    ypos+=20;
  }
  text("cnt: "+parseInt(cnt), 10,ypos);
  translate(width/2,height/2);
  if(keyIsPressed === true){//defines controls use https://keycode.info/ to modify keys
      switch(keyCode){
	case 72:
	  historyStepBack();
	  break;
	case 84: // t
          cnt=0;
          updateRandAll();
	  break;
	case 32: // spacebar
          play = !play;
          break;
        case 81:
          vars.k+=varspds.k;
          targvars.k+=varspds.k;
          break;
        case 65:
          vars.k-=varspds.k;
          targvars.k-=varspds.k;
          break;
        case 87:
          vars.k2+=varspds.k2;
          targvars.k2+=varspds.k2;
          break;
        case 83:
          vars.k2-=varspds.k2;
          targvars.k2-=varspds.k2;
          break;
        case 69:
          vars.p+=varspds.p;
          targvars.p+=varspds.p;
          break;
        case 68:
          vars.p-=varspds.p;
          targvars.p-=varspds.p;
          break;
        case 82:
          vars.h+=varspds.h;
          targvars.h+=varspds.h;
          break;
        case 70:
          vars.h-=varspds.h;
          targvars.h-=varspds.h;
          break;
      }
  }
  let r = R/vars.k;
  let r2 = R/vars.k2;
  let x = (R + r) * cos(0) + (r + r2) * cos(0 + (R*0)/r - R*0/(vars.p*r)) + h * cos(0 + R*0/r - R*0/(vars.p*r) - R*0/(vars.p*r2));
  let y = (R + r) * sin(0) + (r + r2) * sin(0 + (R*0)/r - R*0/(vars.p*r)) + h * sin(0 + R*0/r - R*0/(vars.p*r) - R*0/(vars.p*r2));
  for(let t = 0; t<200;t+=0.02){//range and precision
     let oldx = x;
     let oldy = y;
     x = (R + r) * cos(t) + (r + r2) * cos(t + (R*t)/r - R*t/(vars.p*r)) + h * cos(t + R*t/r - R*t/(vars.p*r) - R*t/(vars.p*r2));
     y = (R + r) * sin(t) + (r + r2) * sin(t + (R*t)/r - R*t/(vars.p*r)) + h * sin(t + R*t/r - R*t/(vars.p*r) - R*t/(vars.p*r2));
     line(oldx,oldy,x,y);
  }
}

