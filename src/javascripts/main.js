"use strict"

import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

const svg_down = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M6.34317 7.75732L4.92896 9.17154L12 16.2426L19.0711 9.17157L17.6569 7.75735L12 13.4142L6.34317 7.75732Z"
  fill="currentColor"
/>
</svg>`;

const svg_grid = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M7 7V11H11V7H7Z" fill="currentColor" />
<path d="M13 7H17V11H13V7Z" fill="currentColor" />
<path d="M13 13V17H17V13H13Z" fill="currentColor" />
<path d="M7 13H11V17H7V13Z" fill="currentColor" />
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M3 3H21V21H3V3ZM5 5V19H19V5H5Z"
  fill="currentColor"
/>
</svg>`;

const svg_play = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z"
  fill="currentColor"
/>
<path d="M16 12L10 16.3301V7.66987L16 12Z" fill="currentColor" />
</svg>`;

const svg_reset = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M5.33929 4.46777H7.33929V7.02487C8.52931 6.08978 10.0299 5.53207 11.6607 5.53207C15.5267 5.53207 18.6607 8.66608 18.6607 12.5321C18.6607 16.3981 15.5267 19.5321 11.6607 19.5321C9.51025 19.5321 7.58625 18.5623 6.30219 17.0363L7.92151 15.8515C8.83741 16.8825 10.1732 17.5321 11.6607 17.5321C14.4222 17.5321 16.6607 15.2935 16.6607 12.5321C16.6607 9.77065 14.4222 7.53207 11.6607 7.53207C10.5739 7.53207 9.56805 7.87884 8.74779 8.46777L11.3393 8.46777V10.4678H5.33929V4.46777Z"
  fill="currentColor"
/>
</svg>`;

const svg_step = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM14 9C14 8.44772 14.4477 8 15 8C15.5523 8 16 8.44772 16 9V15C16 15.5523 15.5523 16 15 16C14.4477 16 14 15.5523 14 15V9ZM13 12L7 15.4641V8.5359L13 12Z"
  fill="currentColor"
/>
</svg>`;

const svg_pause = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M9 9H11V15H9V9Z" fill="currentColor" />
<path d="M15 15H13V9H15V15Z" fill="currentColor" />
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
  fill="currentColor"
/>
</svg>`;

const svg_theme = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8V16Z"
  fill="currentColor"
/>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4V8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16V20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
  fill="currentColor"
/>
</svg>`;

const svg_up = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M17.6569 16.2427L19.0711 14.8285L12.0001 7.75739L4.92896 14.8285L6.34317 16.2427L12.0001 10.5858L17.6569 16.2427Z"
  fill="currentColor"
/>
</svg>`;

const svg_download = `<?xml version="1.0" encoding="utf-8"?>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z" fill="currentColor"/>
</svg>`;

const svg_right = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M10.5858 6.34317L12 4.92896L19.0711 12L12 19.0711L10.5858 17.6569L16.2427 12L10.5858 6.34317Z"
  fill="currentColor"
/>
</svg>`;

const svg_left = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="currentColor"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M16.2426 6.34317L14.8284 4.92896L7.75739 12L14.8285 19.0711L16.2427 17.6569L10.5858 12L16.2426 6.34317Z"
  fill="currentColor"
/>
</svg>`;

const svg_eye = `<svg
width="24"
height="24"
viewBox="0 0 24 24"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
  fill="currentColor"
/>
<path
  fill-rule="evenodd"
  clip-rule="evenodd"
  d="M12 3C17.5915 3 22.2898 6.82432 23.6219 12C22.2898 17.1757 17.5915 21 12 21C6.40848 21 1.71018 17.1757 0.378052 12C1.71018 6.82432 6.40848 3 12 3ZM12 19C7.52443 19 3.73132 16.0581 2.45723 12C3.73132 7.94186 7.52443 5 12 5C16.4756 5 20.2687 7.94186 21.5428 12C20.2687 16.0581 16.4756 19 12 19Z"
  fill="currentColor"
/>
</svg>`;

function hide_from_assistive_tech(root)
{
  root.querySelectorAll('svg').forEach(function(svg){ svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false'); });
}

const NAV = document.getElementById("NAV");
const MENU = document.getElementById("MENU");

const PLAY = document.getElementById("PLAY");
const PAUSE = document.getElementById("PAUSE");
const STEP = document.getElementById("STEP");
const RESET = document.getElementById("RESET");
const COUNT = document.getElementById("COUNT");
const LOC = document.getElementById("LOC");

const UP = document.getElementById("UP");
const DOWN = document.getElementById("DOWN");

const FREQUENCY = document.getElementById("FREQUENCY");
const GRID = document.getElementById("GRID");
const THEME = document.getElementById("THEME");
const HIDE_CONTROLS = document.getElementById("HIDE_CONTROLS");
const COL = document.getElementById("COL");
const NAME = document.getElementById("NAME");
const DOWNLOAD = document.getElementById("DOWNLOAD");
const SELECT = document.getElementById("SELECT");
const IMPORT = document.getElementById("IMPORT");
const LOAD = document.getElementById("LOAD");
const FILE_TO_LOAD = document.getElementById("FILE_TO_LOAD");

const CONTROLS = document.getElementById("CONTROLS");

const MOVE_LEFT = document.getElementById("MOVE_LEFT");
const MOVE_UP = document.getElementById("MOVE_UP");
const MOVE_DOWN = document.getElementById("MOVE_DOWN");
const MOVE_RIGHT = document.getElementById("MOVE_RIGHT");
const ZOOM_OUT = document.getElementById("ZOOM_OUT");
const ZOOM_IN = document.getElementById("ZOOM_IN");

PLAY.innerHTML = svg_play.trim();
PAUSE.innerHTML = svg_pause.trim();
STEP.innerHTML = svg_step.trim();
RESET.innerHTML = svg_reset.trim();

UP.innerHTML = svg_up.trim();
DOWN.innerHTML = svg_down.trim();

GRID.innerHTML = svg_grid.trim();
THEME.innerHTML = svg_theme.trim();
HIDE_CONTROLS.innerHTML = svg_eye.trim();
DOWNLOAD.innerHTML = svg_download.trim();

MOVE_LEFT.innerHTML = svg_left.trim();
MOVE_UP.innerHTML = svg_up.trim();
MOVE_DOWN.innerHTML = svg_down.trim();
MOVE_RIGHT.innerHTML = svg_right.trim();

const STATUS = document.getElementById("STATUS");

hide_from_assistive_tech(document.body);

// Polite live-region message; cleared first so repeated text is re-announced.
function announce(message)
{
  STATUS.textContent = '';
  setTimeout(function(){ STATUS.textContent = message; }, 20);
}

const CANVAS = document.getElementById("CANVAS");
const c = CANVAS.getContext("2d");

PLAY.onclick = function(){ window.gol.play() };
PAUSE.onclick = function(){ window.gol.stop() };
STEP.onclick = function(){ window.gol.step() };
RESET.onclick = function(){ window.gol.reset() };

GRID.onclick = function(){ window.gol.toggle_grid() };
THEME.onclick = function(){ window.gol.toggle_dark() };
HIDE_CONTROLS.onclick = function(){ hide_controls() };
COL.onchange = function() { window.gol.change_col() };
DOWNLOAD.onclick = function(){ window.gol.download() };
SELECT.onclick = function(){ IMPORT.click() };
IMPORT.addEventListener('change', function() {
  const selected = this.files[0];
  if(selected)
  {
    FILE_TO_LOAD.textContent = 'Selected file: ' + selected.name;
  }
  else
  {
    FILE_TO_LOAD.textContent = '';
  }
});
LOAD.onclick = function(){ window.gol.import() };

MOVE_LEFT.onclick = function(){ window.gol.move_offset('a') };
MOVE_RIGHT.onclick = function(){ window.gol.move_offset('d') };
MOVE_UP.onclick = function(){ window.gol.move_offset('w') };
MOVE_DOWN.onclick = function(){ window.gol.move_offset('s') };

ZOOM_OUT.onclick = function(){ window.gol.zoom_out() };
ZOOM_IN.onclick = function(){ window.gol.zoom_in() };

import { Square, Vector, Viewport, count_neighbours, apply_rules, serialize_state, parse_state, ImportError, LIMITS } from './life.js';

class GameOfLife extends Viewport
{
  constructor(
    square_width,
    width,
    height,
    )
  {
    super(square_width, width, height);
    this.debug = false;
    this.grid = true;
    this.dark = false;
    this.edit = true;

    this.white = '#fafafa';
    this.black = '#323232';
    this.col = '#af1919';
    this.col2 = '#1919af';

    this.interval = null;
    this.generations = 0;
    COUNT.textContent = this.generations;
    this.dead_game = false;

    this.loc();
    this.alive = [];
    this.purgatory = [];
    this.cursor = new Vector(0, 0);
    this.draw();
    this.update_menus();
  }

  reset()
  {
    this.debug = false;
    this.grid = true;
    this.edit = true;

    clearTimeout(this.interval);
    this.interval = null;
    this.generations = 0;
    COUNT.textContent = this.generations;
    this.dead_game = false;
    this.square_width = 50;

    this.calculate_dimensions(0);
    this.offset_x = 0;
    this.offset_y = 0;
    this.saved_click = new Vector(null, null);
    this.alive = [];
    this.purgatory = [];
    this.loc();
    this.draw();
    this.update_menus();
    PLAY.style.display = '';
    PAUSE.style.display = 'none';
    this.cursor = new Vector(0, 0);
    announce('Board reset. Generation 0');
  }

  loc()
  {
    LOC.textContent = '(' + -this.offset_x + ', ' + -this.offset_y + ')';
  }

  change_col()
  {
    this.col = COL.value;
  }

  play()
  {
    if(this.interval === null)
    {
      if(FREQUENCY.value < 0.01)FREQUENCY.value = 0.01;
      if(FREQUENCY.value > 10)FREQUENCY.value = 10;
      this.period = FREQUENCY.value * 1000;
      this.schedule(this.period);
    }
    PLAY.style.display = 'none';
    PAUSE.style.display = '';
    this.move_focus(PAUSE);
    announce('Simulation running');
  }

  // Chained timeouts instead of setInterval: a slow generation delays the next
  // one rather than queueing ticks behind it, so the UI thread can always
  // handle input and painting between generations.
  schedule(delay)
  {
    this.interval = setTimeout(() =>
    {
      const start = performance.now();
      this.iterate();
      if(this.interval === null) return;
      this.schedule(Math.max(0, this.period - (performance.now() - start)));
    }, delay);
  }

  stop()
  {
    if(this.interval !== null)
    {
      clearTimeout(this.interval);
      this.interval = null;
    }
    PLAY.style.display = '';
    PAUSE.style.display = 'none';
    this.move_focus(PLAY);
    announce(this.dead_game ? 'Simulation stopped: the board is stable' : 'Simulation paused at generation ' + this.generations);
  }

  // The play/pause pair swap visibility; keep focus on the one that remains.
  move_focus(button)
  {
    if(document.activeElement === PLAY || document.activeElement === PAUSE) button.focus();
  }

  step()
  {
    if(this.interval !== null) this.stop();
    this.iterate();
    PLAY.style.display = '';
    PAUSE.style.display = 'none';
    announce('Generation ' + this.generations + ', ' + this.alive.length + ' live cells');
  }

  toggle_grid()
  {
    this.grid = !this.grid;
    this.draw();
    this.update_toggle_states();
  }

  toggle_dark()
  {
    this.dark = !this.dark;
    this.draw();
    this.update_menus();
  }

  // Single place that mirrors grid/theme/controls state into aria-pressed.
  update_toggle_states()
  {
    GRID.setAttribute('aria-pressed', String(this.grid));
    THEME.setAttribute('aria-pressed', String(this.dark));
    HIDE_CONTROLS.setAttribute('aria-pressed', String(CONTROLS.style.display === ''));
  }

  update_menus()
  {
    this.update_toggle_states();
    if(this.dark)
    {
      NAV.classList.remove('bg-mod_light');
      MENU.classList.remove('bg-mod_light');

      NAV.classList.add('bg-mod_dark');
      MENU.classList.add('bg-mod_dark');

      NAV.classList.remove('text-mod_dark');
      MENU.classList.remove('text-mod_dark');

      NAV.classList.add('text-mod_light');
      MENU.classList.add('text-mod_light');

      CONTROLS.classList.remove('bg-mod_light');
      CONTROLS.classList.add('bg-mod_dark');
      CONTROLS.classList.remove('text-mod_dark');
      CONTROLS.classList.add('text-mod_light');
    }
    else
    {
      NAV.classList.remove('bg-mod_dark');
      MENU.classList.remove('bg-mod_dark');

      NAV.classList.add('bg-mod_light');
      MENU.classList.add('bg-mod_light');

      NAV.classList.remove('text-mod_light');
      MENU.classList.remove('text-mod_light');

      NAV.classList.add('text-mod_dark');
      MENU.classList.add('text-mod_dark');

      CONTROLS.classList.add('bg-mod_light');
      CONTROLS.classList.remove('bg-mod_dark');
      CONTROLS.classList.add('text-mod_dark');
      CONTROLS.classList.remove('text-mod_light');
    }
  }

  query_click(x, y)
  {
    if(!this.edit) return;
    const cell = this.cell_at(x, y);
    if(cell !== null) this.toggle_cell(cell.x, cell.y);
    this.draw();
  }

  // Returns true when the cell is alive afterwards.
  toggle_cell(x, y)
  {
    const index = this.alive.findIndex(function(item)
    {
      return item.x === x && item.y === y;
    });
    if(index !== -1)
    {
      this.alive.splice(index, 1);
      return false;
    }
    this.alive.push(new Square(x, y, 0));
    return true;
  }

  is_alive(x, y)
  {
    return this.alive.some(function(item){ return item.x === x && item.y === y; });
  }

  describe_cursor()
  {
    return 'Cell ' + this.cursor.x + ', ' + this.cursor.y + ', ' + (this.is_alive(this.cursor.x, this.cursor.y) ? 'alive' : 'empty');
  }

  // Keyboard equivalent of pointer editing and navigation.
  move_cursor(dx, dy)
  {
    this.cursor.x += dx;
    this.cursor.y += dy;
    this.scroll_to_cell(this.cursor.x, this.cursor.y);
    this.loc();
    this.draw();
    announce(this.describe_cursor());
  }

  toggle_cursor_cell()
  {
    if(!this.edit)
    {
      announce('Editing is locked while the simulation has run. Reset to edit cells.');
      return;
    }
    const alive = this.toggle_cell(this.cursor.x, this.cursor.y);
    this.draw();
    announce('Cell ' + this.cursor.x + ', ' + this.cursor.y + (alive ? ' born' : ' removed'));
  }

  update_saved_click(x, y)
  {
    if(super.update_saved_click(x, y)) this.draw();
  }

  resolve_saved_click(x, y)
  {
    if(super.resolve_saved_click(x, y))
    {
      this.draw();
      this.loc();
    }
  }

  zoom_out()
  {
    super.zoom_out();
    this.draw();
  }

  zoom_in()
  {
    super.zoom_in();
    this.draw();
  }

  move_offset(direction)
  {
    super.move_offset(direction);
    this.loc();
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
    COUNT.textContent = this.generations;
  }

  count()
  {
    if(this.edit) this.edit = false;
    this.purgatory = count_neighbours(this.alive);
  }

  dead_or_alive()
  {
    const result = apply_rules(this.alive, this.purgatory);
    this.alive = result.alive;
    this.purgatory.length = 0;
    return result.change;
  }

  draw()
  {
    if(this.dark) c.fillStyle = this.black;
    else c.fillStyle = this.white;

    c.fillRect(0, 0, this.width, this.height);

    if(this.grid)
    {
      if(this.dark) c.strokeStyle = this.white;
      else c.strokeStyle = this.black;

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

    if(this.dark) c.fillStyle = this.col;
    else c.fillStyle = this.col;

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

    if(document.activeElement === CANVAS)
    {
      c.lineWidth = 3;
      c.strokeStyle = this.dark ? this.white : this.black;
      c.strokeRect(
        ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * this.cursor.x ) ),
        ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * this.cursor.y ) ),
        this.square_width,
        this.square_width
      );
    }

    if(this.debug)
    {
      if(this.dark) c.fillStyle = this.col2;
      else c.fillStyle = this.col2;

      for(let i = 0; i < this.purgatory.length; i++)
      {
        c.fillRect(
        ( ( this.offset_x * this.square_width ) + this.offset_x_render + ( this.square_width * this.purgatory[i].x ) ),
        ( ( this.offset_y * this.square_width ) + this.offset_y_render + ( this.square_width * this.purgatory[i].y ) ),
        this.square_width,
        this.square_width
        );
      }

      if(this.dark) c.fillStyle = this.light;
      else c.fillStyle = this.dark;

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

  download()
  {
    if(this.alive.length === 0)
    {
      window.alert('no information to download');
      return;
    }

    let file_name = '';
    if(NAME.value === null) file_name = new Date().toISOString().replace(/[-:]/g, "").replace(/[.]/g, "_");
    else file_name = NAME.value;

    const settings = {
      generations:this.generations,
      col:this.col,
      offset_x:this.offset_x,
      offset_y:this.offset_y,
      square_width:this.square_width,
      frequency:FREQUENCY.value,
      grid:this.grid,
      dark:this.dark,
      name:file_name,
      edit:this.edit,
    };

    const json_data = serialize_state(this.alive, settings);
    const blob = new Blob([json_data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const filename = `${file_name}.json`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  import()
  {
    const file = IMPORT.files[0];
    if(!file)
    {
      window.alert('no file selected');
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => window.alert('Import failed: the file could not be read.');
    reader.onload = (event) =>
    {
      let imported;
      try
      {
        imported = parse_state(event.target.result);
      }
      catch(error)
      {
        const message = error instanceof ImportError ? error.message : 'unexpected error';
        window.alert(`Import failed: ${message} The current board was not changed.`);
        return;
      }

      // Everything validated: apply atomically.
      if(imported.alive !== null) this.alive = imported.alive;
      if(imported.settings !== null)
      {
        const settings = imported.settings;
        this.generations = settings.generations;
        this.col = settings.col;
        COL.value = settings.col;
        this.square_width = settings.square_width;
        this.offset_x = settings.offset_x;
        this.offset_y = settings.offset_y;
        FREQUENCY.value = settings.frequency;
        this.grid = settings.grid;
        this.dark = settings.dark;
        this.edit = settings.edit;
        NAME.value = settings.name;
        this.fit_square_width();
        this.loc();
        this.update_menus();
      }
      this.draw();
    };
    if(file.size > LIMITS.max_file_bytes)
    {
      window.alert('Import failed: the file is too large. The current board was not changed.');
      return;
    }
    reader.readAsText(file);
  }
}

function hide_controls()
{
  if(CONTROLS.style.display === '') CONTROLS.style.display = 'none';
  else CONTROLS.style.display = '';
  window.gol.update_toggle_states();
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

document.addEventListener('wheel', function(event)
{
  if(MENU.style.display === 'none')
  {
    if(event.deltaY < 0) window.gol.zoom_in();
    else if(event.deltaY > 0) window.gol.zoom_out();
  }
});

CANVAS.addEventListener('focus', function(){ window.gol.draw(); });
CANVAS.addEventListener('blur', function(){ window.gol.draw(); });

const CURSOR_KEYS = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

CANVAS.addEventListener('keydown', function(event)
{
  if(event.altKey || event.ctrlKey || event.metaKey) return;
  if(event.key in CURSOR_KEYS)
  {
    event.preventDefault();
    window.gol.move_cursor(...CURSOR_KEYS[event.key]);
  }
  else if(event.key === 'Enter' || event.key === ' ')
  {
    event.preventDefault();
    window.gol.toggle_cursor_cell();
  }
});

document.onkeydown = function(event)
{
  const target = event.target;
  if(target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
  if(MENU.style.display === 'none')
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
}

CANVAS.onmousedown = function(event)
{
  if(MENU.style.display === 'none')
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
}

CANVAS.onmousemove = function(event)
{
  return;
  if(window.gol.saved_click.x !== null && window.gol.saved_click.y !== null)
  {
    let rect = CANVAS.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    window.gol.update_saved_click(x, y);
  }
}

CANVAS.onmouseup = function(event)
{
  if(MENU.style.display === 'none')
  {
    if(event.button === 1 || event.button === 2)
    {
      let rect = CANVAS.getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      window.gol.resolve_saved_click(x, y);
    }
  }
}

// Keep the disclosure buttons' state and focus in step with the menu.
new MutationObserver(function()
{
  const open = MENU.style.display !== 'none';
  UP.setAttribute('aria-expanded', String(open));
  DOWN.setAttribute('aria-expanded', String(open));
}).observe(MENU, { attributes: true, attributeFilter: ['style'] });

// The activated disclosure button hides itself (Alpine x-show, applied on a
// later animation frame). Remember where focus should go and move it as soon
// as that button is actually displayed.
let pending_focus = null;
function focus_when_visible()
{
  if(pending_focus && getComputedStyle(pending_focus).display !== 'none')
  {
    pending_focus.focus();
    pending_focus = null;
  }
}
const disclosure_observer = new MutationObserver(focus_when_visible);
disclosure_observer.observe(UP, { attributes: true, attributeFilter: ['style'] });
disclosure_observer.observe(DOWN, { attributes: true, attributeFilter: ['style'] });
UP.addEventListener('click', function(){ pending_focus = DOWN; });
DOWN.addEventListener('click', function(){ pending_focus = UP; });

window.addEventListener("resize", resize);
document.addEventListener("DOMContentLoaded", start);