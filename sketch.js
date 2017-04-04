var can = 400;
var rows = 20;
var columns = 20;

var openSet = [];
var closedSet = [];
var start;
var end;
var path = [];
var grid = [];
var pause = true;
var ready = false;
var clickCount = 0;

var selectedHeuristic = 'Some of Square Error';

function removeFromArray(arr, el) {
  var i;
  for (i = arr.length - 1; i >= 0; i--) {
    if(arr[i] == el || (arr[i].x == el.x && arr[i].y == el.y)) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr;
}

function init() {
  for (var i = 0; i < rows; i ++) {
    for (var j = 0; j < columns; j ++) {
      grid[i] = grid[i] || [];
      grid[i][j] = new square(i, j, rows, grid);;
    }
  }
  if(pause) return;

  //if(ready) return;

  //grid = new Array(columns).fill(0);

  start = start || grid[0][0];
  end = end || grid[rows - 1][columns - 1];

  start.value = 1;
  start.f = 0;
  start.g = 0;
  start.h = 0;
  openSet.push(start);
  end.value = Infinity;
  ready = true;
  drawBoard();
}

function updateCanvas() {
  can = this.value();
  resizeCanvas(can, can)
  pause = true;
  init();
}

function updateColumns() {
  columns = this.value();
  pause = true;
  init();
}

function updateRows() {
  rows = this.value();
  pause = true;
  init();
}

function runPause() {
  pause = !pause;
  this.html(pause ? 'Run' : 'Pause');
  init();
}

function selectEvent() {
  selectedHeuristic = this.value();
}

function setup() {
  var c = createCanvas(can, can);
  c.parent('canvas-container');
  init();

  var r = createInput(rows, Number).input(updateRows);
  var co = createInput(columns, Number).input(updateColumns);
  var upC = createInput(can, Number).input(updateCanvas);
  var sel = createSelect();
  sel.option('Some of Square Error');
  sel.option('Eucladean');
  sel.option('Taxi Cab');
  sel.changed(selectEvent);

  var btn = createButton('Run', true);
  btn.mousePressed(runPause);

  r.parent('controls-container');
  co.parent('controls-container');
  upC.parent('controls-container');
  sel.parent('controls-container');
  btn.parent('controls-container');
}

function drawBoard () {
  background(255);
  stroke(0);

  //init();

  for (var i = 0; i < rows; i ++) {
    for (var j = 0; j < columns; j ++) {
      grid[i] = grid[i] || [];
      if(grid[i][j] == -1) {
        fill(150, 0, 0);
      } else if(grid[i][j] > 0) {
        fill(0, 150, 0);
      } else if((i + j) % 2 !== 0) {
        fill(0);
      } else {
        fill(255);
      }
      //grid[i][j] = new square(i, j, rows, grid);
      /*if(grid[i][j].value === 1) {
        //current
        grid[i][j].display();
      } else if(grid[i][j].value === 2) {
        //visited
        grid[i][j].display();
      } else */
      if(grid[i][j]) {
        if(grid[i][j].value === Infinity) {
          //Target
          grid[i][j].display(color(255, 0, 0));
        } else {
          grid[i][j].display();
        }
      }
    }
  }

  showProgress();
}

function draw() {
  background(200);
  drawBoard();
  if(!pause && ready) {
    process();
  }
}

function showProgress() {
  closedSet.forEach(function (item) {
    item.display(color(255, 0, 0));
  });
  openSet.forEach(function (item) {
    item.display(color(0, 255, 0));
  });
  path.forEach(function (item) {
    item.display(color(0, 0, 255));
  });
}

function process() {
  if(openSet.length > 0) {
    // still going

    var best = 0;
    for (var i = 0; i < openSet.length; i++) {
      if(openSet[i].f < openSet[best].f) {
        best = i;
      }
    }

    var current = openSet[best];

    var temp = current;
    path = [];
    path.push(temp);
    while(temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }

    if(current.x == end.x && current.y == end.y) {
      console.log('Done!', path.length - 1);
      var p = createP('Done in: ' + (path.length - 1) + " steps");
      p.parent('controls-container');
      showProgress();
      noLoop();
    }

    openSet = removeFromArray(openSet, current);
    closedSet.push(current);
    current.value = 1;
    current.addNeighbors();
    current.neighbors.forEach(function(neighbor) {
      if(!inOpenSet(neighbor)) openSet.push(neighbor);
    });

  } else {
    //no solution found
    console.log('failed!');
    noLoop();
  }
}

function inOpenSet(sq) {
  return openSet.some(function(item) {
    return item.x == sq.x && item.y == sq.y;
  });
}

function mousePressed() {
  if(mouseX > width || mouseY > height || clickCount > 2) return;
  var i = parseInt(mouseX / ((width - 50) / rows)),
      j = parseInt(mouseY / ((height - 50) / columns));

  clickCount++;

  grid[i][j].clicked();
}


