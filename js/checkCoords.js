var W;
var H;

function setCoords() {
	W = window.innerWidth;
	H = window.innerHeight;

function checkCoords() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	var pc = document.getElementById("paper").coords;
	pc = paperCoords(w, h);
	console.log("window width: " + w);
	console.log("window height: " + h);
	console.log("paper coords: " + pc);
}

function paperCoords(w, h) {
	var paper = document.getElementById("paper");
	var coords;
	var x1, y1, x2, y2, x3, y3, x4, y4;
	x1 = (95/1838)*w;
	x2 = (525/1838)*w;
	x3 = (660/1838)*w;
	x4 = (260/1838)*w;
	y1 = 0;
	y2 = 0;
	y3 = (610/968)*h;
	y4 = (700/968)*h;
	coords=x1.toString()+','+y1.toString()+','+x2.toString()+','+y2.toString()+','+
		x3.toString()+','+y3.toString()+','+x4.toString()+','+y4.toString();

	return coords;
}
