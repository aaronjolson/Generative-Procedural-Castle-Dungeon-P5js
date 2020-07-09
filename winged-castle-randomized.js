// Author: Aaron Olson
// script for building out winged castle
// relies on p5 js, and because of that it is essentially all inside of a continuous loop
// this script relies heavily on global variables, so things won't be reset on re-draw every second.
var cols, rows;
var w = 6;
var grid = [];
var current;

// main body tiers / front hall 
var body_totalTiers = getRandom(1, 5);
var body_tierLengthIncrement = getRandom(1, 8);
var body_tierWidthIncrement = getRandom(1, 3);
var body_sumTierLength = 0;
var body_sumTierWidth = 0;
var body_builtTiers = 0;
var body_builtRows = 0;
var body_topIndex = undefined;

// for building out the central room/main chamber
var mainSize = getRandom(2, 30); // should probably be even number, for getting wing center?
var mainPartsBuilt = 0;
var mainW1 = getRandom(2, 10); // Also width??
var mainW2 = getRandom(1, 4); // width
var mainWidth = mainW1 * 2 + mainW2 * 2;
// for reference the total width of the main body is 7*2 + 2*2
var mainChamberCentralIndex = undefined; // main chamber needs to be built before wings

// end / alter tiers
var end_totalTiers = getRandom(2, 6);
var end_tierLengthIncrement = getRandom(1, 4);
var end_tierWidthIncrement = getRandom(2, 5);
var end_sumTierWidth = getRandom(2, 6);
var end_sumTierLength = getRandom(0, 4); // tied to the total tiers, 1,1 == 2 , 1,0 = 1
var end_builtTiers = 0; 
var end_builtRows = undefined; // this ends up being current postion plus 1

// for building out the cross part of the wing span
var wingHeight = getRandom(2,8);
var wingConnectorWidth = getRandom(2, 6);
var wingWidth = getRandom(2, 10) + wingConnectorWidth;

// global for keeping track of the wing span rows built
var wingRowBuilt = 0;
var lWingEndIndex = undefined;
var rWingEndIndex = undefined;

var wingSpireWidth = getRandom(2, 10);
var wingSpireLength = getRandom(0, (body_tierLengthIncrement * body_totalTiers));
console.log(wingSpireLength);
var wingSpireRowsBuilt = 0;

function getRandom (low, high) {
  return~~ (Math.random() * (high - low)) + low;
}

function setup() {
  createCanvas(1000, 700);
  cols = floor(width/w);
  rows = floor(height/w);
  frameRate(30);

  // Creates a giant array of cell objects to move through
  for (var   j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  // bottom center square
  let bc = Math.floor((cols * rows) - cols/2)

  // set the start square point
  current = grid[bc];
}

function draw(){
  background(51);

  // Draws the cells on the page
  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  
  //sets the cell to visited
  current.visited = true;
  current.highlight();

  buildBody();
  buildMain();
  buildEnd();
  buildWings();
  buildWingSpires();
}

function buildBody(){
  // for loop to build out main body
  for (body_builtTiers; body_builtTiers < body_totalTiers; body_builtTiers++){
    // lay out the tiers
    for (let q = 0; q < body_sumTierLength + body_tierLengthIncrement; q++){
      // move up the the center tile of the next row
      let center = Math.floor(cols * (rows - (body_builtRows + 1)) - cols/2);
      current = grid[center];
      current.visited = true;
      
      // lay out the next row
      for (let t = 0; t < body_sumTierWidth * 2 + ((body_tierWidthIncrement * 2) + 1); t++){
        let rowTileNumber = (current.index) - ((body_sumTierWidth + (body_tierWidthIncrement)) - t );
        grid[rowTileNumber].visited = true;
      }
      body_builtRows += 1;
    }
    body_sumTierLength += body_tierLengthIncrement;
    body_sumTierWidth += body_tierWidthIncrement;
  }
}

function buildMain(){
  for (mainPartsBuilt; mainPartsBuilt < mainSize; mainPartsBuilt++){
    // move up the the center tile of the next row
    let center = Math.floor(cols * (rows - (body_builtRows + 1)) - cols/2);
    current = grid[center];
    current.visited = true;

    console.log('herr')
    if (mainPartsBuilt === Math.floor(mainSize/2)){
      mainChamberCentralIndex = center;
      console.log(mainChamberCentralIndex);
    } 
    
    // lay out the next row
    for (let t = 0; t < mainW1 * 2 + ((mainW2 * 2) + 1); t++){
      let rowTileNumber = (current.index) - ((mainW1 + (mainW2)) - t );
      grid[rowTileNumber].visited = true;
    }
    body_builtRows += 1;
  }
}

function buildEnd(){
  end_builtRows = body_builtRows;
  // for loop to build out main end
  for (end_builtTiers; end_builtTiers < end_totalTiers; end_builtTiers++){
    // console.log(end_builtTiers);
    // console.log(end_sumTierLength + end_tierLengthIncrement);
    // lay out the tiers
    for (let q = 0; q < end_sumTierLength + end_tierLengthIncrement; q++){
      // move up the the center tile of the next row
      let center = Math.floor(cols * (rows - (end_builtRows + 1)) - cols/2);
      current = grid[center];
      current.visited = true;
      
      // lay out the next row
      for (let t = 0; t < end_sumTierWidth * 2 + ((end_tierWidthIncrement * 2) + 1); t++){
        let rowTileNumber = (current.index) - ((end_sumTierWidth + (end_tierWidthIncrement)) - t );
        grid[rowTileNumber].visited = true;
      }
      end_builtRows += 1;
    }
    if (end_sumTierLength > 1){
      end_sumTierLength -= end_tierLengthIncrement;
    }
    end_sumTierWidth -= end_tierWidthIncrement;
  }
}

function buildWings(){
  // TO build the wing cross span
  // take main body central index
  // create logic to create wing span that includes the wing span
  // move center to either + or - 1/2 of the wing length
  // build the wings by rows that encorporate the length moving up or down accoringly
   // plus sign so build downwards
  merkle = (wingWidth * 2 + Math.floor(mainWidth)) * 2;
  // console.log(merkle);
  // console.log(mainChamberCentralIndex);
  for (wingRowBuilt; wingRowBuilt < wingHeight; wingRowBuilt++){
    // start = mainChamberCentralIndex + Math.floor(wingHeight / 2) - (wingRowBuilt * rows);
    start = mainChamberCentralIndex + (wingRowBuilt * cols);
    console.log(start);

    current = grid[start];
    current.visited = true

    for (tile = 0; tile < merkle; tile++){
      coaca = start + tile - (Math.floor(merkle/2))
      // console.log(coaca);
      current = grid[coaca];
      // console.log(current);
      current.visited = true;
      if (tile === 0 && wingRowBuilt === wingHeight-1){
        lWingEndIndex = coaca;
      }
      if (tile === merkle-1 && wingRowBuilt === wingHeight-1){
        rWingEndIndex = coaca;
      } 
    }
  }
  // while creating the wing span, save two indexes, for the central end point on each wing
  // once the wing cross span has been built, 
  // take the two indexes and build down the wing spire length
}

function buildWingSpires(){
// to build out the wing spires

  for (wingSpireRowsBuilt; wingSpireRowsBuilt < wingSpireLength; wingSpireRowsBuilt++){
    // build out the left spire
    start = lWingEndIndex + (wingSpireRowsBuilt * cols);
    for (let tile = 0; tile < wingSpireWidth; tile++){
      kek = start + tile 
      current = grid[kek];
      current.visited = true;
    }
  }

  wingSpireRowsBuilt = 0;
  for (wingSpireRowsBuilt; wingSpireRowsBuilt < wingSpireLength; wingSpireRowsBuilt++){
     // build out the right spire
    start = rWingEndIndex + (wingSpireRowsBuilt * cols);
    for (let tile = 0; tile < wingSpireWidth; tile++){
      kek = start - tile;
      current = grid[kek];
      current.visited = true;
    }
  }

}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.index = i + (j * cols);
    this.walls = [true, true, true, true];
    this.visited = false;

    this.highlight = function() {
      var x = this.i*w;
      var y = this.j*w;
      noStroke();
      fill(0, 0, 255, 255);
      rect(x, y, w, w);
    }
  
    this.show = function() {
      var x = this.i*w;
      var y = this.j*w;
      stroke(255);
      if (this.walls[0]) {
        line(x, y, x + w, y);
      }
      if (this.walls[1]) {
        line(x + w, y, x + w, y + w);
      }
      if (this.walls[2]) {
        line(x + w, y + w, x, y + w);
      }
      if (this.walls[3]) {
        line(x, y + w, x, y);
      }
  
      if (this.visited) {
        noStroke();
        fill(255, 255, 255, 255);
        rect(x, y, w, w);
      }
    }
  }