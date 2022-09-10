var res = 1;
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var w =canvas.width;
var h = canvas.height;
var cx=0.2685;
var cy=0;

class Complex {
	constructor(re,im){
		this.re=re;
		this.im=im;
	}
	get size(){
		return Math.sqrt(this.re**2 + this.im**2);
	}
	square(){
		let new_re=this.re**2-this.im**2;
		let new_im=2*(this.re*this.im);
		this.re=new_re;
		this.im=new_im;
	}
	add(c){
		this.re+=c.re;
		this.im+=c.im;
	}
}

function cmult(c1,c2){
	return new Complex(c1.re*c2.re - c1.im*c2.im, c1.re*c2.im + c1.im*c2.re);
}

function cadd(c1,c2){
	return new Complex(c1.re + c2.re, c1.im+c2.im);
}

var center = new Complex(0,0);
var zoom = 0.5;
var maxiter=200;
var colors =chroma.scale(['blue','red','green']).colors(maxiter+1, 'rgb');

document.addEventListener('keydown', function(event) {
	switch(event.key){
		case 'w':
			center.im-=.05/zoom;
			break;
		case 's':
			center.im+=.05/zoom;
			break;
		case 'd':
			center.re+=.05/zoom;
			break;
		case 'a':
			center.re-=.05/zoom;
			break;
		case 'q':
			zoom=zoom/1.1;
			break;
		case 'e':
			zoom=zoom*1.1;
			break;
		case 'ArrowUp':
			cy-=.01/zoom;
			break;
		case 'ArrowDown':
			cy+=.01/zoom;
			break;
		case 'ArrowLeft':
			cx-=.01/zoom;
			break;
		case 'ArrowRight':
			cx+=.01/zoom;
			break;
      }
	console.log(`c=${cx}+${cy}i`);
})

function cross(h,w){
  //scale pixel coords to complex plane around center
  let a = [...Array(h).keys()];
  let b = [...Array(w).keys()];
  let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
  let cartesian = (a, b, ...c) => b ? cartesian(f(a, b), ...c) : a;
  return cartesian(a,b)
}

function checkBounded(x,y){
  c=new Complex(cx,cy);
  z=new Complex(x,y);
  i=0;
  
  while(i<maxiter && z.size<2){
	z.square();
	z.add(c);
  	i++;
  }
  rgba=[...colors[i]];
  rgba.push(255);
  return rgba;
}

let cartesian=cross(w,h);

function draw(){
	pixies=cartesian.map(p=>[((p[0]/h)*2-1)/zoom+center.im, ((p[1]/w)*2-1)/zoom+center.re]);
  rgb_arr = pixies.map(p=>checkBounded(p[1],p[0]))
  byte_array=new Uint8ClampedArray(w*h*4);
  for (i = 0;i<rgb_arr.length;i++){
	  for (j=0;j<4;j++){
		  byte_array[4*i+j]=rgb_arr[i][j];
	  }
  }

  imdat= new ImageData(byte_array, w, h);
  ctx.putImageData(imdat,0,0);
  ctx.fillRect( (((cx-center.re)*zoom)+1)*(h/2), (((cy-center.im)*zoom)+1)*(h/2),5,5);
}
setInterval(draw,6);
