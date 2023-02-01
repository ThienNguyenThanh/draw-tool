const DEFAULT_COLOR = '#b2d6ff';
const DEFAULT_MODE = 'draw';
const DEFAULT_SIZE = 16;

let currentColor = DEFAULT_COLOR;
let currentMode = DEFAULT_MODE;
let currentSize = DEFAULT_SIZE;
let gridContainer = document.querySelector('.grid');
let clearButton = document.getElementById('clear-button');

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

function clearGrid(){
    gridContainer.innerHTML = '';
    setupGrid();
}

function changeColor(e){
    if(e.type === 'mouseover' && !mouseDown) return
    e.target.style.backgroundColor = 'red';
}

function setupGrid(){
    for(var idx=0; idx < 256;idx++){
        let gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        // gridItem.innerHTML = ' x ';
        gridContainer.appendChild(gridItem);
    
        gridItem.addEventListener('mouseover', changeColor);
        gridItem.addEventListener('mousedown', changeColor);
    }
}


clearButton.onclick = () => clearGrid();

window.onload = () => {
    setupGrid();
}

