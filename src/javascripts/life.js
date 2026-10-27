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

// Import/export. `data` is { version, alive: [{x, y, count}], settings: {...} }.
export const STATE_VERSION = 1;
export const LIMITS = {
  max_file_bytes: 5 * 1024 * 1024,
  max_cells: 10000,
  max_coordinate: 1000000,
  max_offset: 1000000,
  min_square_width: 1,
  max_square_width: 1000,
  min_frequency: 0.01,
  max_frequency: 10,
  max_generations: 1000000000,
  max_name_length: 255,
};

export class ImportError extends Error
{
  constructor(message)
  {
    super(message);
    this.name = 'ImportError';
  }
}

export function serialize_state(alive, settings)
{
  return JSON.stringify({ version: STATE_VERSION, alive, settings }, null, 2);
}

const is_plain_object = (v) => typeof v === 'object' && v !== null && !Array.isArray(v);

function integer_in(value, min, max, label)
{
  if(typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max)
  {
    throw new ImportError(`${label} must be a whole number between ${min} and ${max}.`);
  }
  return value;
}

function boolean_of(value, label)
{
  if(typeof value !== 'boolean') throw new ImportError(`${label} must be true or false.`);
  return value;
}

function validate_alive(list)
{
  if(!Array.isArray(list)) throw new ImportError('"alive" must be a list of cells.');
  if(list.length > LIMITS.max_cells)
  {
    throw new ImportError(`Too many cells (${list.length}); the limit is ${LIMITS.max_cells}.`);
  }
  const seen = new Set();
  const result = [];
  for(let i = 0; i < list.length; i++)
  {
    const cell = list[i];
    if(!is_plain_object(cell)) throw new ImportError(`Cell ${i} is not an object.`);
    const m = LIMITS.max_coordinate;
    const x = integer_in(cell.x, -m, m, `Cell ${i} x`);
    const y = integer_in(cell.y, -m, m, `Cell ${i} y`);
    const count = cell.count === undefined ? 0 : integer_in(cell.count, 0, 8, `Cell ${i} count`);
    const key = `${x},${y}`;
    if(seen.has(key)) throw new ImportError(`Duplicate cell at (${x}, ${y}).`);
    seen.add(key);
    result.push(new Square(x, y, count));
  }
  return result;
}

function validate_settings(s)
{
  if(!is_plain_object(s)) throw new ImportError('"settings" must be an object.');
  const L = LIMITS;
  if(typeof s.col !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(s.col))
  {
    throw new ImportError('Colour must be a hex value like #af1919.');
  }
  const frequency = typeof s.frequency === 'string' && s.frequency.trim() !== '' ? Number(s.frequency) : s.frequency;
  if(typeof frequency !== 'number' || !Number.isFinite(frequency))
  {
    throw new ImportError('Frequency must be a number.');
  }
  if(typeof s.name !== 'string' || s.name.length > L.max_name_length)
  {
    throw new ImportError(`Name must be text of at most ${L.max_name_length} characters.`);
  }
  if(typeof s.square_width !== 'number' || !Number.isFinite(s.square_width))
  {
    throw new ImportError('Square width must be a number.');
  }
  return {
    generations: integer_in(s.generations, 0, L.max_generations, 'Generations'),
    col: s.col,
    offset_x: integer_in(s.offset_x, -L.max_offset, L.max_offset, 'Offset x'),
    offset_y: integer_in(s.offset_y, -L.max_offset, L.max_offset, 'Offset y'),
    square_width: Math.min(L.max_square_width, Math.max(L.min_square_width, s.square_width)),
    frequency: String(Math.min(L.max_frequency, Math.max(L.min_frequency, frequency))),
    grid: boolean_of(s.grid, 'Grid'),
    dark: boolean_of(s.dark, 'Dark'),
    name: s.name,
    edit: boolean_of(s.edit, 'Edit'),
  };
}

// Returns { alive: Square[] | null, settings: object | null }.
// Throws ImportError (with a user-facing message) on invalid JSON or an invalid
// or oversized state; nothing is returned unless the whole file validates.
// Missing sections come back as null. Files without a version are treated as v1.
export function parse_state(text)
{
  if(typeof text !== 'string') throw new ImportError('The file could not be read as text.');
  if(text.length > LIMITS.max_file_bytes) throw new ImportError('The file is too large to import.');
  let imported;
  try
  {
    imported = JSON.parse(text);
  }
  catch(error)
  {
    throw new ImportError('The file is not valid JSON.');
  }
  if(!is_plain_object(imported)) throw new ImportError('The file must contain a JSON object.');
  if(imported.version !== undefined && imported.version !== STATE_VERSION)
  {
    throw new ImportError(`Unsupported file version: ${String(imported.version).slice(0, 20)}.`);
  }
  const has = (k) => Object.prototype.hasOwnProperty.call(imported, k);
  return {
    alive: has('alive') ? validate_alive(imported.alive) : null,
    settings: has('settings') ? validate_settings(imported.settings) : null,
  };
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
      && y > this.offset_y_render && y < this.height - this.offset_y_render;
  }

  // Single screen -> cell conversion shared by editing clicks and pan drags.
  // Pixels are measured from the grid origin; null when outside the grid.
  screen_to_cell(x, y)
  {
    if(!this.in_bounds(x, y)) return null;
    return this.locate(x - this.offset_x_render, y - this.offset_y_render);
  }

  cell_at(x, y)
  {
    return this.screen_to_cell(x, y);
  }

  pan_cell_at(x, y)
  {
    return this.screen_to_cell(x, y);
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
    if(direction === 's') this.offset_y -= Math.max(1, Math.floor(this.rows/10));
    if(direction === 'd') this.offset_x -= Math.max(1, Math.floor(this.columns/10));
    this.calculate_dimensions(0);
  }
}
