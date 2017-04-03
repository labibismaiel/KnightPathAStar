var light = "#E9E9E9";
var dark = 0;

function square(x, y, n, grid) {
  //x and y are the coordinates of the square
  //n is the size of the grid

  this.x = x;
  this.y = y;
  this.h = Infinity;
  this.g = Infinity;
  this.f = (grid[x][y] && grid[x][y].f) || Infinity;

  this.previous = undefined;

  this.width = (width - 50) / n;
  this.height = (height - 50) / n;

  this.pixelStartX = this.x * (width - 50) / n;
  this.pixelStartY = this.y * (height - 50) / n;

  //square color
  this.col = (grid[x][y] && grid[x][y].col) || ((x + y) % 2 !== 0 ? dark : light);

  this.neighbors = (grid[x][y] && grid[x][y].neighbors) || [];

  this.display = function(clr) {
    fill(clr || this.col);
    rect(this.pixelStartX, this.pixelStartY, this.width, this.height);
  }

  this.addNeighbors = function() {
    //to do
    //should consider symmety
    var possibilities = [
      {
        x: x + 1,
        y: y + 2
      },
      {
        x: x + 2,
        y: y + 1
      },
      {
        x: x + 1,
        y: y - 2
      },
      {
        x: x + 2,
        y: y - 1
      },
      {
        x: x - 2,
        y: y + 1
      },
      {
        x: x - 1,
        y: y + 2
      },
      {
        x: x - 2,
        y: y - 1
      },
      {
        x: x - 1,
        y: y - 2
      }
    ];

    this.neighbors = [];

    var temp;

    for(var i = 0; i < possibilities.length; i++) {
      temp = possibilities[i];
      if(temp.x > -1 && temp.x < n && temp.y > -1 && temp.y < n) {
        if(grid[temp.x][temp.y] && !this.inClosedSet(temp)) {

          grid[temp.x][temp.y].g = grid[temp.x][temp.y].g > this.g + 1 ? this.g + 1 : grid[temp.x][temp.y].g;
          grid[temp.x][temp.y].h = heuristic(temp);
          grid[temp.x][temp.y].f = grid[temp.x][temp.y].g + grid[temp.x][temp.y].h;

          grid[temp.x][temp.y].previous = this;

          this.neighbors.push(grid[temp.x][temp.y]);

        }

      }
    }
  }

  function heuristic(temp) {
    // eucladean
    //return dist(temp.x, temp.y, end.x, end.y);

    // taxi cab
    //return abs(temp.x - end.x) + abs(temp.y - end.y);

    //mine base on knight movement
    return (temp.x - end.x)*(temp.x - end.x) + (temp.y - end.y)*(temp.y - end.y);
  }

  this.inClosedSet = function(sq) {
    return closedSet.some(function(item) {
      return item.x == sq.x && item.y == sq.y;
    });
  }
  /*
  this.clicked = function() {
    if(mouseX < this.pixelStartX || mouseX > this.pixelStartX + this.width) return;
    if(mouseY < this.pixelStartY || mouseY > this.pixelStartY + this.height) return;
  }
  */
}
