"use strict"

import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

const PLAY = document.getElementById("PLAY");
const PAUSE = document.getElementById("PAUSE");
const STEP = document.getElementById("STEP");
const RESET = document.getElementById("RESET");
const COUNT = document.getElementById("COUNT");
const GRID = document.getElementById("GRID");
const FREQUENCY = document.getElementById("FREQUENCY");
const CANVAS = document.getElementById("CANVAS");
const c = CANVAS.getContext("2d");

PLAY.onclick = function(){ window.gol.play() };
PAUSE.onclick = function(){ window.gol.stop() };
STEP.onclick = function(){ window.gol.step() };
RESET.onclick = function(){ window.gol.reset() };
GRID.onclick = function(){ window.gol.toggle_grid() };

class Square
{
  constructor(
    x,
    y,
    count,
  )
  {
    this.x = x;
    this.y = y;
    this.count = count;
  }
}

class Vector
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

class Surround{
  constructor(x, y)
  {
    this.up = new Vector(x, y + 1);
    this.down = new Vector(x, y - 1);
    this.left = new Vector(x - 1, y);
    this.right = new Vector(x + 1, y);

    this.up_right = new Vector(x + 1, y + 1);
    this.up_left = new Vector(x - 1, y + 1);
    this.down_right = new Vector(x + 1, y - 1)
    this.down_left = new Vector(x - 1, y - 1);

    this.vectors = [
      this.up,
      this.down,
      this.left,
      this.right,

      this.up_right,
      this.up_left,
      this.down_right,
      this.down_left,
    ];
  }
}

class GameOfLife
{
  constructor(
    square_width,
    width,
    height,
    )
  {
    this.debug = false;
    this.grid = true;

    this.interval = null;
    this.generations = 0;
    COUNT.innerHTML = this.generations;
    this.dead_game = false;

    this.square_width = square_width;
    this.width = width;
    this.height = height;
    this.calculate_dimensions(0);
    this.offset_x = 0;
    this.offset_y = 0;
    this.saved_click = new Vector(null, null);
    this.alive = [];
    this.purgatory = [];
    this.draw();
  }

  reset()
  {
    this.debug = false;
    this.grid = true;

    clearInterval(this.interval);
    this.interval = null;
    this.generations = 0;
    COUNT.innerHTML = this.generations;
    this.dead_game = false;
    this.square_width = 50;

    this.calculate_dimensions(0);
    this.offset_x = 0;
    this.offset_y = 0;
    this.saved_click = new Vector(null, null);
    this.alive = [];
    this.purgatory = [];
    this.draw();
  }

  play()
  {
    if(this.interval === null)
    {
      this.interval = setInterval(this.iterate.bind(this), FREQUENCY.value * 1000);
    }
  }

  stop()
  {
    if(this.interval !== null)
    {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  step()
  {
    if(this.interval !== null) this.stop();
    this.iterate();
  }

  toggle_grid()
  {
    this.grid = !this.grid;
    this.draw();
  }

  calculate_dimensions(zoom_in)
  {
    let old_columns = this.columns;
    let old_rows = this.rows;

    this.columns = Math.floor(this.width/this.square_width);
    this.rows = Math.floor(this.height/this.square_width);

    if(this.columns <= 1 || this.rows <= 1) return false;

    this.offset_x_render = ( this.width - (this.square_width * this.columns) ) / 2;
    this.offset_y_render = ( this.height - (this.square_width * this.rows) ) / 2;

    this.square_count = this.rows * this.columns;

    if(zoom_in === 1)
    {
      this.offset_x = Math.floor(this.offset_x - (old_columns - this.columns)/2);
      this.offset_y = Math.floor(this.offset_y - (old_rows - this.rows)/2);
    }
    else if(zoom_in === 2)
    {
      this.offset_x = Math.floor(this.offset_x - (old_columns - this.columns)/2);
      this.offset_y = Math.floor(this.offset_y - (old_rows - this.rows)/2);
    }

    if(this.square_count > 0) return true;
    else return false;
  }

  query_click(x, y)
  {
    if(x > this.offset_x_render && x < this.width - this.offset_x_render && y > this.offset_y_render && y < this.width - this.offset_y_render)
    {
      let mod_x = x % this.square_width;
      let mod_y = y % this.square_width;

      let loc_x = Math.floor( (x - mod_x) / this.square_width);
      let loc_y = Math.floor( (y - mod_y) / this.square_width);

      let offset_loc_x = loc_x - this.offset_x;
      let offset_loc_y = loc_y - this.offset_y;

      let index = this.alive.findIndex(function(item)
      {
        return item.x === offset_loc_x && item.y === offset_loc_y;
      });

      if(index !== -1)
      {
        this.alive.splice(index, 1);
      }
      else
      {
        let new_square = new Square(offset_loc_x, offset_loc_y, 0);
        this.alive.push(new_square);
      }
    }
    this.draw();
  }

  save_click(x, y)
  {
    if(x > this.offset_x_render && x < this.width - this.offset_x_render && y > this.offset_y_render && y < this.width - this.offset_y_render)
    {
      let mod_x = x % this.square_width;
      let mod_y = y % this.square_width;

      let loc_x = Math.floor( (x - mod_x) / this.square_width);
      let loc_y = Math.floor( (y - mod_y) / this.square_width);

      let offset_loc_x = loc_x - this.offset_x;
      let offset_loc_y = loc_y - this.offset_y;

      this.saved_click.x = offset_loc_x;
      this.saved_click.y = offset_loc_y;
    }
  }

  update_saved_click(x, y)
  {
    if(x > this.offset_x_render && x < this.width - this.offset_x_render && y > this.offset_y_render && y < this.width - this.offset_y_render)
    {
      let mod_x = x % this.square_width;
      let mod_y = y % this.square_width;

      let loc_x = Math.floor( (x - mod_x) / this.square_width);
      let loc_y = Math.floor( (y - mod_y) / this.square_width);

      let offset_loc_x = loc_x - this.offset_x;
      let offset_loc_y = loc_y - this.offset_y;

      let offset_dif_x = this.saved_click.x - offset_loc_x;
      let offset_dif_y = this.saved_click.y - offset_loc_y;

      this.offset_x -= offset_dif_x;
      this.offset_y -= offset_dif_y;

      this.calculate_dimensions(0);
      this.draw();

      this.saved_click.x = offset_loc_x;
      this.saved_click.y = offset_loc_y;
    }
  }

  resolve_saved_click(x, y)
  {
    if(x > this.offset_x_render && x < this.width - this.offset_x_render && y > this.offset_y_render && y < this.width - this.offset_y_render)
    {
      let mod_x = x % this.square_width;
      let mod_y = y % this.square_width;

      let loc_x = Math.floor( (x - mod_x) / this.square_width);
      let loc_y = Math.floor( (y - mod_y) / this.square_width);

      let offset_loc_x = loc_x - this.offset_x;
      let offset_loc_y = loc_y - this.offset_y;

      let offset_dif_x = this.saved_click.x - offset_loc_x;
      let offset_dif_y = this.saved_click.y - offset_loc_y;

      this.offset_x -= offset_dif_x;
      this.offset_y -= offset_dif_y;

      this.calculate_dimensions(0);
      this.draw();

      this.saved_click.x = null;
      this.saved_click.y = null;
    }
  }

  zoom_out()
  {
    this.square_width /= 2;
    let check = this.calculate_dimensions(2);
    if(check === false)
    {
      this.square_width *= 2;
      this.calculate_dimensions(1);
    }
    this.draw();
  }

  zoom_in()
  {
    this.square_width *= 2;
    let check = this.calculate_dimensions(1);
    if(check === false)
    {
      this.square_width /= 2;
      this.calculate_dimensions(2);
    }
    this.draw();
  }

  move_offset(direction)
  {
    if(direction === 'w')
    {
      this.offset_y += Math.max(1, Math.floor(this.rows/10));
    }
    if(direction === 'a')
    {
      this.offset_x += Math.max(1, Math.floor(this.columns/10));
    }
    if(direction === 's')
    {
      this.offset_y -= Math.max(1, Math.floor(this.columns/10));
    }
    if(direction === 'd')
    {
      this.offset_x -= Math.max(1, Math.floor(this.rows/10));
    }
    this.calculate_dimensions(0);
    this.draw();
  }

  iterate()
  {
    this.count();
    let change = this.dead_or_alive();
    this.draw();
    if(change === false)
    {
      this.dead_game = true;
      this.stop();
      return;
    }
    this.generations++;
    COUNT.innerHTML = this.generations;
  }

  count()
  {
    this.purgatory = [];

    for(let i = 0; i < this.alive.length; i++)
    {
      let count = 0;
      let surround = new Surround(this.alive[i].x, this.alive[i].y);

      for(let g = 0; g < surround.vectors.length; g++)  
      {
        let check = false;
        for(let y = 0; y < this.alive.length; y++)
        {
          if(this.alive[y].x === surround.vectors[g].x && this.alive[y].y === surround.vectors[g].y)
          {
            count++;
            check = true;
            break;
          }
        }
        if(check === false)
        {
          let create = true;
          for(let p = 0; p < this.purgatory.length; p++)
          {
            if(this.purgatory[p].x === surround.vectors[g].x && this.purgatory[p].y === surround.vectors[g].y)
            {
              this.purgatory[p].count++;
              create = false;
            }
          }
          if(create === true)
          {
            this.purgatory.push(
              new Square(surround.vectors[g].x, surround.vectors[g].y, 1)
            );
          }
        }
      }

      this.alive[i].count = count;
    }
  }

  dead_or_alive()
  {
    let change = false;
    let count = this.alive.length;
    this.alive = this.alive.filter(square => square.count === 2 || square.count === 3);
    if(count !== this.alive.length) change = true;
    
    for(let i = 0; i < this.purgatory.length; i++)
    {
      if(this.purgatory[i].count === 3)
      {
        let new_square = new Square(this.purgatory[i].x, this.purgatory[i].y, 0);
        this.alive.push(new_square);
        change = true;
      }
    }
    this.purgatory.length = 0;
    return change;
  }

  draw()
  {
    c.clearRect(0, 0, this.width, this.height);

    if(this.grid)
    {
      c.strokeStyle = "black";
      c.lineWidth = 0.1;
  
      for(let i = 0; i <= this.columns; i++)
      {
        let frag = i * this.square_width;
        c.beginPath();
        c.moveTo(frag + this.offset_x_render, 0 + this.offset_y_render);
        c.lineTo(frag + this.offset_x_render, this.height - this.offset_y_render);
        c.stroke();
      }
  
      for(let i = 0; i <= this.rows; i++)
      {
        let frag = i * this.square_width;
        c.beginPath();
        c.moveTo(0 + this.offset_x_render, frag + this.offset_y_render);
        c.lineTo(this.width - this.offset_x_render, frag + this.offset_y_render);
        c.stroke();
      }
    }

    let min_x = -this.offset_x;
    let max_x = -this.offset_x + this.columns;

    let min_y = -this.offset_y;
    let max_y = -this.offset_y + this.rows;

    c.fillStyle = "rgb(175,25,25)";
    for(let i = 0; i < this.alive.length; i++)
    {
      if(
        ( this.alive[i].x >= min_x )
        &&
        ( this.alive[i].x < max_x )
        &&
        ( this.alive[i].y >= min_y )
        &&
        ( this.alive[i].y < max_y )
        )
      {
        c.fillRect(
        ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * this.alive[i].x ) ),
        ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * this.alive[i].y ) ),
        this.square_width,
        this.square_width
        );
      }
    }

    if(this.debug)
    {
      c.fillStyle = "rgb(50,50,175)";
      for(let i = 0; i < this.purgatory.length; i++)
      {
        c.fillRect(
        ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * this.purgatory[i].x ) ),
        ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * this.purgatory[i].y ) ),
        this.square_width,
        this.square_width
        );
      }
    }

    if(this.debug)
    {
      c.fillStyle = "rgb(50,50,50)";
      for(let x = 0; x < this.columns; x++)
      {
        for(let y = 0; y < this.rows; y++)
        {
          if(this.debug)
          {
            c.fillText(x,
              ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * x ) ) + this.square_width/2,
              ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * y ) ) + this.square_width/2);
            c.fillText(y,
              ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * x ) ) + this.square_width/2,
              ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * y ) ) + this.square_width/2+10);
          }
        }
      }
    }
  }
}

function resize()
{
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
  window.gol.width = CANVAS.width;
  window.gol.height = CANVAS.height;
  window.gol.calculate_dimensions(0);
  window.gol.draw();
}

function start()
{
  CANVAS.width = window.innerWidth;
  CANVAS.height = window.innerHeight;
  window.gol = new GameOfLife(50, CANVAS.width, CANVAS.height);
}

document.addEventListener('wheel', function(event) {
  if(event.deltaY < 0) window.gol.zoom_in();
  else if(event.deltaY > 0) window.gol.zoom_out();
});

document.onkeydown = function(event)
{
  if(event.key == "m") window.gol.zoom_in();
  if(event.key == "n") window.gol.zoom_out();

  if(event.key == "w") window.gol.move_offset('w');
  if(event.key == "a") window.gol.move_offset('a');
  if(event.key == "s") window.gol.move_offset('s');
  if(event.key == "d") window.gol.move_offset('d');

  if(event.key == "c")
  {
    window.gol.count();
    window.gol.draw();
  }
  if(event.key == "v")
  {
    window.gol.dead_or_alive();
    window.gol.draw();
  }
  if(event.key == "i") window.gol.iterate();
}

CANVAS.onmousedown = function(event)
{
  if(event.button === 0)
  {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    window.gol.query_click(x, y);
  }
  if(event.button === 1 || event.button === 2)
  {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    window.gol.save_click(x, y);
  }
}

CANVAS.onmousemove = function(event)
{
  return;
  console.log('firing');
  if(window.gol.saved_click.x !== null && window.gol.saved_click.y !== null)
  {
    console.log('firing again');
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    window.gol.update_saved_click(x, y);
  }
}

CANVAS.onmouseup = function(event)
{
  if(event.button === 1 || event.button === 2)
  {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    window.gol.resolve_saved_click(x, y);
  }
}

window.addEventListener("resize", resize);
document.addEventListener("DOMContentLoaded", start);