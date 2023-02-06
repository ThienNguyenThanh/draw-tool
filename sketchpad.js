const DEFAULT_COLOR = 'black';
const DEFAULT_MODE = 'draw';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;

let pen, pointer, shape, textPointer, deleteItem;


let listTools = document.getElementsByClassName('tool');
console.log(listTools)
for (var i = 0; i < listTools.length; i++) {
	listTools[i].addEventListener("click", function() {
	  var current = document.getElementsByClassName("active");
	  if(current[0]){
		current[0].className = current[0].className.replace(" active", "");
	  }
	  this.className += " active";
	});
  }

function changeTool(image){
	currentMode = image.parentElement.className.split(' ')[1]
	console.log(currentMode)
	// switch(currentMode){
	// 	case "pointer":
	// 		image.parentElement.className += " active";
	// 		pointer.activate();
	// 		break;
	// 	case "pen":
	// 		image.parentElement.className += " active";
	// 		pen.activate();
	// 		break;
	// 	case "textPointer":
	// 		image.parentElement.className += " active";
	// 		textPointer.activate();
	// 		break;
	// 	case "shape":
	// 		shape.activate();
	// 		break;
	// 	case "deleteItem":
	// 		deleteItem.activate();
	// 		break;
	// }
	// let listTool = {
	// 	"pen": pen,
	// 	"pointer": pointer,
	// 	"shape": shape,
	// 	"textPointer":textPointer,
	// 	"deleteItem": deleteItem
	// }
	// listTool[currentMode].activate();
	// image.parentElement.className.replace(" active", '')

	// if(image.parentElement.className.includes('active')){
	// }else{
	// 	image.src = "./assets/images/pointer-on.svg";
	// 	image.parentElement.className += " active";
	// 	pointer.activate();
	// }
	
}


const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener('change', ()=>{
	colorPicker.style.background = colorPicker.value;
	currentColor = colorPicker.value;
})



let canvas = document.getElementById('canvas');
canvas.height = 900;
canvas.width = 1000;



paper.install(window);
window.onload = function () {
	// Setup directly from canvas id:
	paper.setup('canvas');
	let path;
	

	// DRAW TOOL
	pen = new Tool();

	pen.onMouseDown = drawOnMouseDown;
	pen.onMouseUp = drawOnMouseUp;
	pen.onMouseDrag = drawOnMouseDrag;

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

	
	// deleteItem TOOL
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
	// END OF deleteItem TOOL


	// SELECT TOOL
	let hitResult;
	let hitOptions = {
		segments: true,
		stroke: true,
		fill: true,
		tolerance: 5
	};
	
	pointer = new Tool();
	pointer.onMouseDown = selectOnMouseDown;
	pointer.onMouseMove = selectOnMouseMove;
	pointer.onMouseDrag = selectOnMouseDrag;
	
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