// JavaScript Document
function SCRtoCanvas() {
		var fileInput = document.getElementById('fileInput');
		var fileDisplayArea = document.getElementById('fileDisplayArea');
		fileInput.addEventListener('change', function(e) {
			var file = fileInput.files[0];	
				var reader = new FileReader();
				reader.onload = function(e) {
					array = reader.result;
					principal();
				}
				reader.readAsBinaryString(file,'ASCII');		
		});
}
			
function byteString(n) {
  if (n < 0 || n > 255 ) {
      throw new Error(n + " does not fit in a byte");
  }
  return ("000000000" + n.toString(2)).substr(-8)
}
 
function drawPixel (x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;
    canvasData.data[index + 0] = r;
    canvasData.data[index + 1] = g;
    canvasData.data[index + 2] = b;
    canvasData.data[index + 3] = a;
}

function getZXpixel(madress) {
y = Math.floor(madress/32)  //line
block = Math.floor(y/64) //screen part
crow= Math.floor(y/8) //line offset
yr = y - (crow*8)
crow = crow - (block*8)
position = block*2048 + crow*32 + yr*256 + (madress % 32)
	bitvalue = String(array[position]).charCodeAt(0)
	bitvalue = bitvalue % 256
	return byteString(bitvalue)
};

function updateCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}

function gobyte(baite,madress){
	x = (madress % 32)*8;
	y = Math.floor(madress / 32);
	attrib = getZXattrib(madress)
	//attrib = [0,0,0,255,255,0]
	for (i=0; i<8; i++) {
		if (baite[i]==0) { //ink or paper
		r=attrib[0];g=attrib[1];b=attrib[2]} 
		else
		{r=attrib[3];g=attrib[4];b=attrib[5]}
				drawPixel(x+i, y, r, g, b, 255); //x, y, r, g, b, a
				};
};

function getZXattrib(madress) {
	ax = (cadress % 32);
	ay = Math.floor(cadress / 256);
	
	a_address = 6144 + (ax+(ay*32))
	a_bitvalue = String(array[a_address]).charCodeAt(0)
	a_bitvalue = a_bitvalue % 256
	b_attrib = byteString(a_bitvalue)
	
	ink = b_attrib.slice(2,5)
	paper = b_attrib.slice(5,8)
	bright = b_attrib.slice(1).charAt(0)*25
	flash = b_attrib.slice(0)
	luma= 230+bright

	//console.log(ink,paper)
	
	attrib = [ ink.charAt(1)*luma, ink.charAt(0)*luma, ink.charAt(2)*luma, paper.charAt(1)*luma, paper.charAt(0)*luma, paper.charAt(2)*luma ]
	cadress++
	return attrib
 }

function principal() {
console.log('principal')
while (madress < 6144) {
	baite = getZXpixel(madress);
	gobyte(baite,madress)
	madress++
}	
console.log('colors')

updateCanvas();
var element = document.getElementById("fileInput");
element.parentNode.removeChild(element);
var element = document.getElementById("intro_text");
element.parentNode.removeChild(element);
};