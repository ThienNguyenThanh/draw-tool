const DEFAULT_COLOR = '#b2d6ff';
const DEFAULT_MODE = 'draw';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;
let gridContainer = document.querySelector('.grid');
let clearButton = document.getElementById('clear-button');

let canvas = document.getElementById('canvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled  = true;

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

// function clearGrid(){
//     gridContainer.innerHTML = '';
//     setupGrid();
// }

// function changeColor(e){
//     if(e.type === 'mouseover' && !mouseDown) return
//     e.target.style.backgroundColor = 'red';
// }

// function setupGrid(){
//     for(var idx=0; idx < 256;idx++){
//         let gridItem = document.createElement('div');
//         gridItem.className = 'grid-item';
//         // gridItem.innerHTML = ' x ';
//         gridContainer.appendChild(gridItem);
    
//         gridItem.addEventListener('mouseover', changeColor);
//         gridItem.addEventListener('mousedown', changeColor);
//     }
// }


// clearButton.onclick = () => clearCanvas();

// window.onload = () => {
//     setupGrid();
// }


// let [prevX, prevY] = [null, null];
ctx.lineWidth = 20;

// let drawEnable = false;

// window.addEventListener('mousedown', ()=> drawEnable=true )
// window.addEventListener('mouseup', ()=> drawEnable=false )

// window.addEventListener("mousemove", (e) => {
//     if(prevX === null || prevY === null || !drawEnable){
//         prevX = e.clientX;
//         prevY = e.clientY;
//         return
//     }

//     let currentX =  e.clientX;
//     let currentY = e.clientY;

    
//     ctx.lineTo(currentX, currentY);
//     ctx.stroke();

//     ctx.beginPath();
//     ctx.moveTo(currentX, currentY);

//     prevX = currentX;
//     prevY = currentY;

// })
let drawing = false;

function startDraw(e) {
  drawing = true;
  ctx.beginPath();
  draw(e)
}

function endDraw(e) {
  drawing = false;
}

function draw(e) {
  if (!drawing) return;

//   let { x, y } = getMousePos(canvas, e);
  let [ x, y ] = [e.clientX, e.clientY];

  ctx.lineTo(x, y);
  ctx.stroke();

  // for smoother drawing
  // ctx.beginPath();
  // ctx.moveTo(x, y);
}

window.addEventListener("mousedown", startDraw);
window.addEventListener("mouseup", endDraw);
window.addEventListener("mousemove", draw);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// $(document).ready(function() {
//   $(document).on('mousemove', function(e) {
//     $('#circularcursor').css({
//       left: e.pageX,
//       top: e.pageY
//     });
//   })
// });

let cursor = document.getElementById('circularcursor');

document.body.onmousemove = function(e) {
  cursor.style.top = Number(e.clientY -10) + 'px';
  cursor.style.left = Number(e.clientX - 10) + 'px';
  // console.log(Number(e.clientX - 2) + 'px')
}

// document.body.onmousemove = function(e) {
//   document.documentElement.style.setProperty (
//     '--x', (
//       e.clientX+window.scrollX
//     )
//     + 'px'
//   );
//   document.documentElement.style.setProperty (
//     '--y', (
//       e.clientY+window.scrollY
//     ) 
//     + 'px'
//   );
// }