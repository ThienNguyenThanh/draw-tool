const DEFAULT_COLOR = 'black',
 	  DEFAULT_MODE = 'draw',
 	  DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR,
 	currentMode = DEFAULT_MODE,
 	currentSize = DEFAULT_SIZE;

// Tools Bar
let pen, pointer, shape, textPointer,eraser, deleteItem;

// Undo/redo
let historyStack = [null],
	state = 0;


// Tool Switching Effect
let listTools = document.getElementsByClassName('tool');
for (var i = 0; i < listTools.length; i++) {
	listTools[i].addEventListener("click", function() {
		
		currentMode = this.className.split(' ')[1]
		let listTool = {
			"drawpen": pen,
			"pointer": pointer,
			"shape": shape,
			"textPointer":textPointer,
			"colors": pointer,
			"eraser": eraser,
			"deleteItem": deleteItem
		}

		let prev = document.getElementsByClassName("active");
		let prevMode = prev[0].className.split(' ')[1];

		// Change img src
		if(prevMode !== 'colors'){
			prev[0].firstElementChild.src = prev[0].firstElementChild.src.replace(/\/\w+On\./gm, `/${prevMode}.`);
		}
		if( currentMode !== 'colors'){
			this.firstElementChild.src = this.firstElementChild.src.replace(/\/\w+\./gm, `/${currentMode}On.`);
		}

		// Change background of img
		prev[0].className = prev[0].className.replace(" active", "");
		this.className += " active";
		
		// Activate tool
		listTool[currentMode].activate();
	});
  }


const colorPicker = document.getElementById("color-picker");

colorPicker.addEventListener('change', ()=>{
	colorPicker.style.background = colorPicker.value;
	currentColor = colorPicker.value;
})



let canvas = document.getElementById('canvas');
canvas.height = 900;
canvas.width = 1000;


function undo(){
	if(state > 0){
		console.log('undo click')
		historyStack[state].remove();
		state--;
	}
}

function redo(){
	if(state < historyStack.length -1){
		console.log('redo click')
        state++;
        let newPath = new Path(historyStack[state].pathData);
		newPath.strokeColor = historyStack[state].strokeColor;

		historyStack[state] = newPath;

		// new Path().unite(historyStack[state]);
    }
}


paper.install(window);
window.onload = function () {
	// Setup directly from canvas id:
	paper.setup('canvas');
	let path,
		// this layer holds the background pattern
		bottomLayer = new Layer(),  
		// new layer for drawing and erasing on
		topLayer = new Layer();
	

	// DRAW TOOL
	pen = new Tool();

	pen.onMouseDown = drawOnMouseDown;
	pen.onMouseUp = drawOnMouseUp;
	pen.onMouseDrag = drawOnMouseDrag;

	function drawOnMouseDown(event) {
		path = new Path();
		path.strokeColor = currentColor;
		path.strokeWidth = currentSize;
		path.strokeCap = 'round'
		path.add(event.point);
	}

	function drawOnMouseDrag (event) {
		path.add(event.point);
	}

	function drawOnMouseUp(event) {
		path.simplify(10);

		if(state < historyStack.length - 1){
			historyStack = historyStack.slice(0, state +1);
		}
		historyStack.push(path);
		state++;
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

	// ERASER TOOL
	eraser = new Tool()
	eraser.minDistance = 10

	var tmpGroup, mask

	eraser.onMouseDown = function(event) {
		// TODO: deal w/ noop when activeLayer has no children
		//       right now we just draw in white

		// create the path object that will record the toolpath
		path = new Path({
		strokeWidth: 20 * view.pixelRatio,
		strokeCap: 'round',
		strokeJoin: 'round',
		strokeColor: 'white'
		})

		// learned about this blend stuff from this issue on the paperjs repo:
		// https://github.com/paperjs/paper.js/issues/1313

		// move everything on the active layer into a group with 'source-out' blend
		tmpGroup = new Group({
			children: topLayer.removeChildren(),
			blendMode: 'source-out',
			insert: false
		})

		// // combine the path and group in another group with a blend of 'source-over'
		mask = new Group({
			children: [path, tmpGroup],
			blendMode: 'source-over'
		})
	}

	eraser.onMouseDrag = function(event) {
		// onMouseDrag simply adds points to the path
		path.add(event.point)
	}
	// END OF ERASER TOOL
	
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

	// UNDO TOOL
	// END OF UNDO TOOL
	
}