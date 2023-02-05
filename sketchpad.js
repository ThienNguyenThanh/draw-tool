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


var drawLine, selectLine, drawShape, textPointer, deleteItem;

paper.install(window);
window.onload = function () {
	// Setup directly from canvas id:
	paper.setup('canvas');
	let path;


	// DRAW TOOL
	drawLine = new Tool();

	drawLine.onMouseDown = drawOnMouseDown;
	drawLine.onMouseUp = drawOnMouseUp;
	drawLine.onMouseDrag = drawOnMouseDrag;

	function drawOnMouseDown(event) {
		path = new Path();
		path.strokeColor = currentColor;
		path.add(event.point);
	}

	function drawOnMouseDrag (event) {
		path.add(event.point);
	}

	function drawOnMouseUp(event) {
		path.simplify(10);
	}
	// END OF DRAW TOOL

	// TEXT TOOL
	textPointer = new Tool();

	let startPoint,text;
	textPointer.onMouseDown = function(event){
		startPoint = event.point;
		text = new PointText({
			point: [startPoint.x, startPoint.y],
			content: '',
			justification: 'center',
			fontSize: 15
		})
	}

	textPointer.onKeyDown = function textOnKeyDown(event){
		if(event.key === 'backspace'){
			text.content = text.content.replace(/.$/, '');
		}else if(event.key === 'space'){
			text.content += ' ';
		}else {
			text.content += event.key;
		}
	}
	// END OF TEXT TOOL

	
	// DELETE TOOL
	deleteItem = new Tool();
	deleteItem.onMouseDown = deleteItemOnMouseDown;
	deleteItem.onMouseMove = deleteItemOnMouseMove;

	function deleteItemOnMouseMove(event) {
		project.activeLayer.selected = false;
		if (event.item)
			event.item.selected = true;
	}
	function deleteItemOnMouseDown(event){
		var hitResult = project.hitTest(event.point, hitOptions);
		if (!hitResult)
			return;

		hitResult.item.remove();
	}
	// END OF DELETE TOOL


	// SELECT TOOL
	let hitResult;
	let hitOptions = {
		segments: true,
		stroke: true,
		fill: true,
		tolerance: 5
	};
	
	selectLine = new Tool();
	selectLine.onMouseDown = selectOnMouseDown;
	selectLine.onMouseMove = selectOnMouseMove;
	selectLine.onMouseDrag = selectOnMouseDrag;
	
	function selectOnMouseDown(event) {
		// segment = path = null;
		hitResult = project.hitTest(event.point, hitOptions);
		if (!hitResult)

			return;

		if (event.modifiers.shift) {
			if (hitResult.type == 'segment') {
				hitResult.segment.remove();
			};
			return;
		}

		if (hitResult) {
			path = hitResult.item;
		}
	}
	
	function selectOnMouseMove(event) {
		project.activeLayer.selected = false;
		if (event.item)
			event.item.selected = true;
	}
	
	function selectOnMouseDrag(event) {
		if(path && hitResult){
			path.position.x += event.delta.x;
			path.position.y += event.delta.y;
		}
	}
	// END OF SELECT TOOL
	
}