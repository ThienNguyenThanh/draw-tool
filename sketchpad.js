const DEFAULT_COLOR = '#b2d6ff';
const DEFAULT_MODE = 'draw';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;
let gridContainer = document.querySelector('.grid');
let clearButton = document.getElementById('clear-button');

let canvas = document.getElementById('canvas');
canvas.height = 900;
canvas.width = 1000;


let ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled  = true;

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

ctx.lineWidth = 20;
ctx.lineCap = 'round';
ctx.strokeType = 'red';

let drawing = false;

// function startDraw(e) {
//   drawing = true;
//   ctx.beginPath();
//   draw(e)
// }

// function endDraw(e) {
//   drawing = false;
// }

// function draw(e) {
//   if (!drawing) return;

// //   let { x, y } = getMousePos(canvas, e);
//   let [ x, y ] = [e.clientX, e.clientY];

//   ctx.lineTo(x, y);
//   ctx.stroke();

//   // for smoother drawing
//   ctx.beginPath();
//   ctx.moveTo(x, y);
// }

// window.addEventListener("mousedown", startDraw);
// window.addEventListener("mouseup", endDraw);
// window.addEventListener("mousemove", draw);

// function clearCanvas() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

var drawLine, tool2;

paper.install(window);
window.onload = function () {
	// Setup directly from canvas id:
	paper.setup('canvas');
	var path;
	function onMouseDown(event) {
		path = new Path();
		path.strokeColor = 'black';
		path.add(event.point);
	}

	drawLine = new Tool();
	drawLine.onMouseDown = onMouseDown;
	drawLine.onMouseUp = onMouseUp;

	drawLine.onMouseDrag = function (event) {
		path.add(event.point);
	}

	function onMouseUp(event) {
		// Add the mouse up position:
		path.simplify(10);
	}



	tool2 = new Tool();
	tool2.minDistance = 20;
	tool2.onMouseDown = onMouseDown;

	tool2.onMouseDrag = function (event) {
		// Use the arcTo command to draw cloudy lines
		path.arcTo(event.point);
	}
}