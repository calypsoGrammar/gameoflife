"use strict"

export class Square
{
  constructor(x, y, count)
  {
    this.x = x;
    this.y = y;
    this.count = count;
  }
}

export class Vector
{
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }
}

export class Surround
{
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

// Conway rules, step 1: set `count` (live neighbours) on every live square and
// return the dead squares ("purgatory") that touch at least one live square,
// with `count` set to their live-neighbour count.
export function count_neighbours(alive)
{
  const purgatory = [];
  for(let i = 0; i < alive.length; i++)
  {
    let count = 0;
    const surround = new Surround(alive[i].x, alive[i].y);
    for(let g = 0; g < surround.vectors.length; g++)
    {
      let check = false;
      for(let y = 0; y < alive.length; y++)
      {
        if(alive[y].x === surround.vectors[g].x && alive[y].y === surround.vectors[g].y)
        {
          count++;
          check = true;
          break;
        }
      }
      if(check === false)
      {
        let create = true;
        for(let p = 0; p < purgatory.length; p++)
        {
          if(purgatory[p].x === surround.vectors[g].x && purgatory[p].y === surround.vectors[g].y)
          {
            purgatory[p].count++;
            create = false;
          }
        }
        if(create === true)
        {
          purgatory.push(new Square(surround.vectors[g].x, surround.vectors[g].y, 1));
        }
      }
    }
    alive[i].count = count;
  }
  return purgatory;
}

// Conway rules, step 2: survivors have 2 or 3 neighbours, dead squares with
// exactly 3 are born. Returns the new live list and whether anything changed.
export function apply_rules(alive, purgatory)
{
  let change = false;
  const survivors = alive.filter(square => square.count === 2 || square.count === 3);
  if(survivors.length !== alive.length) change = true;
  for(let i = 0; i < purgatory.length; i++)
  {
    if(purgatory[i].count === 3)
    {
      survivors.push(new Square(purgatory[i].x, purgatory[i].y, 0));
      change = true;
    }
  }
  return { alive: survivors, change };
}

export function next_generation(alive)
{
  const purgatory = count_neighbours(alive);
  return apply_rules(alive, purgatory);
}

// Import/export. `data` is { alive: [{x, y, count}], settings: {...} }.
export function serialize_state(alive, settings)
{
  return JSON.stringify({ alive, settings }, null, 2);
}

// Returns { alive: Square[] | null, settings: object | null }.
// Throws on invalid JSON. Missing sections come back as null.
export function parse_state(text)
{
  const imported = JSON.parse(text);
  const result = { alive: null, settings: null };
  if(Object.prototype.hasOwnProperty.call(imported, 'alive'))
  {
    result.alive = imported.alive.map(obj => new Square(obj.x, obj.y, obj.count));
  }
  if(Object.prototype.hasOwnProperty.call(imported, 'settings'))
  {
    result.settings = imported.settings;
  }
  return result;
}

// Pan/zoom state and coordinate mapping, independent of the DOM.
// Cell (x, y) is drawn at pixel
//   offset_x * square_width + offset_x_render + square_width * x.
export class Viewport
{
  constructor(square_width, width, height)
  {
    this.square_width = square_width;
    this.width = width;
    this.height = height;
    this.offset_x = 0;
    this.offset_y = 0;
    this.saved_click = new Vector(null, null);
    this.calculate_dimensions(0);
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
    if(zoom_in === 1 || zoom_in === 2)
    {
      this.offset_x = Math.floor(this.offset_x - (old_columns - this.columns)/2);
      this.offset_y = Math.floor(this.offset_y - (old_rows - this.rows)/2);
    }
    return this.square_count > 0;
  }

  in_bounds(x, y)
  {
    return x > this.offset_x_render && x < this.width - this.offset_x_render
      && y > this.offset_y_render && y < this.width - this.offset_y_render;
  }

  // Cell under the pixel (x, y) measured from the grid origin (used when editing).
  cell_at(x, y)
  {
    if(!this.in_bounds(x, y)) return null;
    return this.locate(x - this.offset_x_render, y - this.offset_y_render);
  }

  // Cell under the pixel (x, y) used by the pan gesture.
  pan_cell_at(x, y)
  {
    if(!this.in_bounds(x, y)) return null;
    return this.locate(x, y);
  }

  locate(x, y)
  {
    const loc_x = Math.floor( (x - (x % this.square_width)) / this.square_width);
    const loc_y = Math.floor( (y - (y % this.square_width)) / this.square_width);
    return new Vector(loc_x - this.offset_x, loc_y - this.offset_y);
  }

  save_click(x, y)
  {
    const cell = this.pan_cell_at(x, y);
    if(cell === null) return;
    this.saved_click.x = cell.x;
    this.saved_click.y = cell.y;
  }

  // Shift the view so the saved cell sits under (x, y). Returns false if outside the grid.
  drag_to(x, y)
  {
    const cell = this.pan_cell_at(x, y);
    if(cell === null) return false;
    this.offset_x -= this.saved_click.x - cell.x;
    this.offset_y -= this.saved_click.y - cell.y;
    this.calculate_dimensions(0);
    return cell;
  }

  update_saved_click(x, y)
  {
    const cell = this.drag_to(x, y);
    if(cell === false) return false;
    this.saved_click.x = cell.x;
    this.saved_click.y = cell.y;
    return true;
  }

  resolve_saved_click(x, y)
  {
    if(this.drag_to(x, y) === false) return false;
    this.saved_click.x = null;
    this.saved_click.y = null;
    return true;
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
  }

  move_offset(direction)
  {
    if(direction === 'w') this.offset_y += Math.max(1, Math.floor(this.rows/10));
    if(direction === 'a') this.offset_x += Math.max(1, Math.floor(this.columns/10));
    if(direction === 's') this.offset_y -= Math.max(1, Math.floor(this.columns/10));
    if(direction === 'd') this.offset_x -= Math.max(1, Math.floor(this.rows/10));
    this.calculate_dimensions(0);
  }
}
