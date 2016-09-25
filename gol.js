(function(document){
	"use strict"
	addEventListener('keypress', pause)
	const canvas = document.createElement("canvas"),
		container = document.querySelector("[data-gol-container]"),
		context = canvas.getContext("2d"),
		width = canvas.width = container.getBoundingClientRect().width,
		height = canvas.height = container.getBoundingClientRect().height,
		fieldWidth = Math.floor((width - 1) / 5),
		fieldHeight = Math.floor((height - 1) / 5),
		updateFrequency = 6,
		canvasData = context.getImageData(0,0,width,height)
	let lastRun,
		lastUpdate = new Date().getTime(),
		field = initField(fieldWidth, fieldHeight),
		paused = false

	function pause(){
		paused = !paused
	}

	/*
	Creates empty field as an array of arrays
	*/
	function initField(w,h){
		const result = []
		for(let i=0; i<w; i++)
			result.push(createEmptyRow(h))
		return result
	}

	/*
	Empty field is filled with dead cells by default
	*/
	function createEmptyRow(h){
		const result = [];
		for(let i=0; i<h; i++)
			result.push(0)
		return result;
	}

	function drawCell(x,y,dead){
		pointToSquare(x,y,4).forEach(el => drawPoint(el.x,el.y,!dead*255))
	}

	/*
	Returns pixel coordinates, that correspond to specified cell coordinate on the field.
	Used to operate between different scales of field and canvas (1 cell is drawn using size^2 pixels)
	and grid pixels.
	*/
	function pointToSquare(x,y,size){
		const result = []
		for(let i=1;i<=size;i++)
			for(let j=1;j<=size;j++)
				result.push(toPoint(x*(size+1)+i,y*(size+1)+j))
		return result
	}

	function toPoint(x,y){
		return {x: x, y: y}
	}

	function drawPixel(x,y,r,g,b,a){
		const index = (x + y * width) * 4
		canvasData.data[index] = r
		canvasData.data[index+1] = g
		canvasData.data[index+2] = b
		canvasData.data[index+3] = a
	}

	function drawPoint(x,y,bit){
		drawPixel(x,y,bit,bit,bit,255)
	}

	function drawGrid(){
		for(let i=0;i<width;i++)
			for(let j=0;j<height;j++)
				if(i%5 === 0 || j%5 === 0)
					drawPixel(i,j,192,192,192,255)
	}

	/*
	Creates new field state
	*/
	function tick(){
		const newField = initField(fieldWidth, fieldHeight)
		for(let i=0;i<fieldWidth;i++)
			for(let j=0;j<fieldHeight;j++){
				newField[i][j] =
					0 + ((!field[i][j] && livingNeighbours(i,j) === 3) || // Cell lives when it was dead and has 3 living neighbours
					field[i][j] && between(livingNeighbours(i,j), 2, 3)) // or when lived and has 2 or 3 neighbours
				if(newField[i][j] !== field[i][j]) drawCell(i,j,newField[i][j])
			}
		field = newField
	}

	function between(val,min,max){
		return val >= min && val <= max
	}

	function livingNeighbours(x,y){
		let count = 0
		for(let i=x-1;i<=x+1;i++)
			for(let j=y-1;j<=y+1;j++)
				if(i!==x || j!==y)
					count += field[clampX(i)][clampY(j)]
		return count
	}

	/*
	Helper function, used to stitch field
	*/
	function clamp(val, max, min){
		min = min | 0;
		return val >= min ?
				(val <= max ?
					val 
					: min + (val - max) - 1)
				: (max - (min - val) + 1)
	}

	function clampX(val) {
		return clamp(val, fieldWidth - 1)
	}

	function clampY(val) {
		return clamp(val, fieldHeight - 1)
	}

	/*
	Converts a pattern from string representation into array of points.
	'*' - live cell
	' ' (space) - dead cell
	Tab is used to align cells.
	*/
	function stringToPoints(x,y,str){
		let result = [],
			currentLine = 0,
			lineWidth = 0

		str = str.replace(/\t+/g, "")
		for(let i=0;i<str.length;i++){
			const c = str.charAt(i)
			if(c === '*') result.push({x:x+(i-lineWidth*currentLine),y:y+currentLine})
			else if(c === '\n') currentLine++, lineWidth = lineWidth || i+1
		}
		return result
	}

	/*
	Patterns are returned by functions, instead of being stored in object as its fields
	It enables to align rows properly with only tabs (spaces can be used to determine dead cell,
	which is the cleanest loooking representation IMO)
	*/
	function box(){
		return "**\n\
				**"
	}

	function blinker(){
		return "***"
	}

	function toad(){
		return " ***\n\
				*** "
	}

	function beehive(){
		return " ** \n\
				*  *\n\
				 ** "
	}

	function loaf(){
		return " ** \n\
				*  *\n\
				 * *\n\
				  * "
	}

	function boat(){
		return "** \n\
				* *\n\
				 * "
	}

	function pentadecathlon(){
		return " * \n\
				 * \n\
				* *\n\
				 * \n\
				 * \n\
				 * \n\
				 * \n\
				* *\n\
				 * \n\
				 * "
	}

	function infiniteGrow1(){
		return "      * \n\
				    * **\n\
				    * * \n\
				    *   \n\
				  *     \n\
				* *     "
	}

	function glider(){
		return "*  \n\
				 **\n\
				** "
	}

	function lwss(){
		return "*  * \n\
				    *\n\
				*   *\n\
				 ****"
	}

	function infiniteGrow2(){
		return "*** *\n\
				*    \n\
				   **\n\
				 ** *\n\
				* * *"
	}

	function infiniteGrow3(){
		return "******** *****   ***      ******* *****"
	}

	function r_pentomino(){
		return " **\n\
				** \n\
				 * "
	}

	function putLiveCell(x,y){
		field[clampX(x)][clampY(y)] = 1
	}

	function createPattern(patterFn,x,y){
		stringToPoints(x,y,patterFn.call()).forEach(coord => putLiveCell(coord.x, coord.y))
	}

	function render(){
		context.putImageData(canvasData, 0, 0)
		requestAnimationFrame(gameLoop)
	}

	/*
	Tick is called only if time elapsed from last call is greater than period.
	This ensures calculations are distributed in time almost equally,
	but cannot counteract slowing simulation down when script does not receive enough cpu time
	to calculate next field state before previous calculation finishes
	*/
	function update(){
		lastRun = new Date().getTime()
		if(lastRun - lastUpdate > 1000/updateFrequency){
			lastUpdate = lastRun
			tick()
		}
	}

	function gameLoop(){
		if(!paused) update()
		render()
	}

	function init(){
		container.appendChild(canvas)
		drawGrid()
		createPattern(box,8,8)
		createPattern(blinker,12,12)
		createPattern(toad,7,16)
		createPattern(infiniteGrow3,5,30)
		createPattern(infiniteGrow1,15,15)
		createPattern(boat,18,20)
		createPattern(pentadecathlon,50,40)
		createPattern(r_pentomino, 70, 30)
		gameLoop()
	}

	init()
}(this.document))