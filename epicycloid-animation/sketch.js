let R = 110;//scale
let k = 2.596;//ratio of first two circles
let targk = k;
let k2 = 0.6955;//ratio of first to third
let targk2 = k2;
let p = 0.5325;//ratio of the paths?
let targp = p;
let cnt=0;
let h = 0;//distance of lever to point
let targh = h;
let spd = 0.0001;
let play = true;

function setup() {
  createCanvas(screen.width,screen.height);
  stroke(255,0,0);
  fill(255,0,0);
  frameRate(24);
}

function updateRandOne(v, mult) {
  return v+(Math.random()*2*spd-spd)*mult;
}
function updateRandAll() {
  if (!cnt){
    cnt=100;
    targk=updateRandOne(k, 200);
    targk2=updateRandOne(k2, 100);
    targp=updateRandOne(p, 100);
    targh=updateRandOne(h,10000);
  }
  k=k+(targk-k)/cnt;
  k2=k2+(targk2-k2)/cnt;
  p=p+(targp-p)/cnt;
  h=h+(targh-h)/cnt;
  cnt-=1;
}
function mousePressed() {
  let fs = fullscreen();
  fullscreen(!fs); 
}
function draw() {
  if (play) {updateRandAll()}
  background(0);
  text("Controls: Q,A: k, W,S: k2, E,D: p, R,F: h",10,10);
  text("k:"+parseFloat(k).toPrecision(4)+", k2: "+parseFloat(k2).toPrecision(4)+", p: "+parseFloat(p).toPrecision(5)+", h:"+parseFloat(h).toPrecision(3),10,30);
  text("tk:"+parseFloat(targk).toPrecision(4)+", tk2: "+parseFloat(targk2).toPrecision(4)+", targp: "+parseFloat(targp).toPrecision(5)+", th:"+parseFloat(targh).toPrecision(3),10,50);
  text("cnt: "+parseInt(cnt), 10,70)
  translate(width/2,height/2);
  if(keyIsPressed === true){//defines controls use https://keycode.info/ to modify keys
      switch(keyCode){
        case 32:
          play = !play;
          break;
        case 81:
          k+=spd;
          targk+=spd;
          break;
        case 65:
          k-=spd;
          targk-=spd;
          break;
        case 87:
          k2+=spd;
          targk2+=spd;
          break;
        case 83:
          k2-=spd;
          targk2-=spd;
          break;
        case 69:
          p+=spd;
          targp+=spd;
          break;
        case 68:
          p-=spd;
          targp-=spd;
          break;
        case 82:
          h+=.3;
          targh+=.3;
          break;
        case 70:
          h-=.3;
          targh-=.3;
          break;
      }
  }
  let r = R/k;
  let r2 = R/k2;
  let x = (R + r) * cos(0) + (r + r2) * cos(0 + (R*0)/r - R*0/(p*r)) + h * cos(0 + R*0/r - R*0/(p*r) - R*0/(p*r2));
  let y = (R + r) * sin(0) + (r + r2) * sin(0 + (R*0)/r - R*0/(p*r)) + h * sin(0 + R*0/r - R*0/(p*r) - R*0/(p*r2));
  for(let t = 0; t<200;t+=0.02){//range and precision
     let oldx = x;
     let oldy = y;
     x = (R + r) * cos(t) + (r + r2) * cos(t + (R*t)/r - R*t/(p*r)) + h * cos(t + R*t/r - R*t/(p*r) - R*t/(p*r2));
     y = (R + r) * sin(t) + (r + r2) * sin(t + (R*t)/r - R*t/(p*r)) + h * sin(t + R*t/r - R*t/(p*r) - R*t/(p*r2));
     line(oldx,oldy,x,y);
  }
}

