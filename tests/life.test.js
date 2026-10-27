import { describe, it, expect } from 'vitest';
import {
  Square, Viewport, next_generation, count_neighbours, apply_rules,
  serialize_state, parse_state,
} from '../src/javascripts/life.js';

const cells = (pairs) => pairs.map(([x, y]) => new Square(x, y, 0));
const keys = (alive) => alive.map(s => `${s.x},${s.y}`).sort();
const sorted = (pairs) => pairs.map(([x, y]) => `${x},${y}`).sort();

function run(pairs, generations)
{
  let alive = cells(pairs);
  let change = false;
  for(let i = 0; i < generations; i++)
  {
    ({ alive, change } = next_generation(alive));
  }
  return { alive, change };
}

describe('Conway rules', () =>
{
  it('keeps a block (still life) unchanged', () =>
  {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const { alive, change } = run(block, 1);
    expect(keys(alive)).toEqual(sorted(block));
    expect(change).toBe(false);
  });

  it('keeps a beehive (still life) unchanged', () =>
  {
    const beehive = [[1, 0], [2, 0], [0, 1], [3, 1], [1, 2], [2, 2]];
    expect(keys(run(beehive, 3).alive)).toEqual(sorted(beehive));
  });

  it('flips a blinker (period-2 oscillator)', () =>
  {
    const horizontal = [[0, 1], [1, 1], [2, 1]];
    const vertical = [[1, 0], [1, 1], [1, 2]];
    const one = run(horizontal, 1);
    expect(keys(one.alive)).toEqual(sorted(vertical));
    expect(one.change).toBe(true);
    expect(keys(run(horizontal, 2).alive)).toEqual(sorted(horizontal));
  });

  it('moves a glider one cell diagonally every 4 generations', () =>
  {
    const glider = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const { alive } = run(glider, 4);
    expect(keys(alive)).toEqual(sorted(glider.map(([x, y]) => [x + 1, y + 1])));
  });

  it('kills isolated and overcrowded cells', () =>
  {
    expect(run([[0, 0]], 1).alive).toEqual([]);
    const plus = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    expect(keys(run(plus, 1).alive)).not.toContain('0,0');
  });

  it('works with negative coordinates', () =>
  {
    const blinker = [[-1, -1], [0, -1], [1, -1]];
    expect(keys(run(blinker, 1).alive)).toEqual(sorted([[0, -2], [0, -1], [0, 0]]));
  });

  it('exposes the two phases separately', () =>
  {
    const alive = cells([[0, 0], [1, 0], [2, 0]]);
    const purgatory = count_neighbours(alive);
    expect(alive.map(s => s.count)).toEqual([1, 2, 1]);
    expect(purgatory.find(s => s.x === 1 && s.y === 1).count).toBe(3);
    expect(keys(apply_rules(alive, purgatory).alive)).toEqual(sorted([[1, 0], [1, 1], [1, -1]]));
  });
});

describe('import/export', () =>
{
  const settings = {
    generations: 7, col: '#af1919', offset_x: 2, offset_y: -3, square_width: 25,
    frequency: '0.5', grid: true, dark: false, name: 'demo', edit: false,
  };

  it('round-trips cells and settings', () =>
  {
    const alive = cells([[0, 0], [1, 0], [-4, 9]]);
    const parsed = parse_state(serialize_state(alive, settings));
    expect(parsed.alive).toEqual(alive);
    expect(parsed.alive[0]).toBeInstanceOf(Square);
    expect(parsed.settings).toEqual(settings);
  });

  it('reports missing sections as null', () =>
  {
    expect(parse_state('{}')).toEqual({ alive: null, settings: null });
    expect(parse_state('{"alive":[{"x":1,"y":2,"count":0}]}').settings).toBeNull();
  });

  it('throws on invalid JSON', () =>
  {
    expect(() => parse_state('not json')).toThrow();
  });
});

describe('viewport', () =>
{
  // 500x500 with 50px squares: 10x10 cells, no centring margin.
  const make = () => new Viewport(50, 500, 500);

  it('computes grid dimensions and centring margins', () =>
  {
    const v = new Viewport(50, 520, 510);
    expect(v.columns).toBe(10);
    expect(v.rows).toBe(10);
    expect(v.offset_x_render).toBe(10);
    expect(v.offset_y_render).toBe(5);
  });

  it('maps screen points to cells for editing', () =>
  {
    const v = new Viewport(50, 520, 520);
    expect(v.cell_at(10 + 1, 10 + 1)).toMatchObject({ x: 0, y: 0 });
    expect(v.cell_at(10 + 120, 10 + 260)).toMatchObject({ x: 2, y: 5 });
    expect(v.cell_at(3, 100)).toBeNull();
  });

  it('accounts for the pan offset when mapping', () =>
  {
    const v = make();
    v.offset_x = 3;
    v.offset_y = -2;
    expect(v.pan_cell_at(60, 60)).toMatchObject({ x: 1 - 3, y: 1 + 2 });
    expect(v.pan_cell_at(60, 60)).toEqual(v.cell_at(60, 60));
  });

  it('pans with wasd by a tenth of the grid, at least one cell', () =>
  {
    const v = make();
    v.move_offset('a'); expect(v.offset_x).toBe(1);
    v.move_offset('d'); expect(v.offset_x).toBe(0);
    v.move_offset('w'); expect(v.offset_y).toBe(1);
    v.move_offset('s'); expect(v.offset_y).toBe(0);
    const big = new Viewport(10, 1000, 1000);
    big.move_offset('a');
    expect(big.offset_x).toBe(10);
  });

  it('zooms in and out by powers of two', () =>
  {
    const v = make();
    v.zoom_in();
    expect(v.square_width).toBe(100);
    expect(v.columns).toBe(5);
    v.zoom_out();
    expect(v.square_width).toBe(50);
    expect(v.columns).toBe(10);
  });

  it('refuses to zoom in past fewer than two columns/rows', () =>
  {
    const v = new Viewport(200, 500, 500);
    v.zoom_in();
    expect(v.square_width).toBe(200);
    expect(v.columns).toBe(2);
  });

  it('keeps the view centred on zoom', () =>
  {
    const v = make();
    v.zoom_in();
    expect(v.offset_x).toBe(-3);
    v.zoom_out();
    // floor() rounding in the existing zoom maths leaves a one-cell drift.
    expect(v.offset_x).toBe(-1);
  });

  it('drags the view with a saved click', () =>
  {
    const v = make();
    v.save_click(25, 25);
    expect(v.saved_click).toMatchObject({ x: 0, y: 0 });
    v.resolve_saved_click(125, 75);
    expect(v.offset_x).toBe(2);
    expect(v.offset_y).toBe(1);
    expect(v.saved_click).toMatchObject({ x: null, y: null });
  });
});

describe('Non-square viewports', () =>
{
  const shapes = {
    portrait: [500, 1000],
    landscape: [1000, 500],
    desktop: [1920, 1080],
  };

  for(const [name, [w, h]] of Object.entries(shapes))
  {
    it(`hit-tests the full height and width (${name})`, () =>
    {
      const v = new Viewport(50, w, h);
      const lastX = w - v.offset_x_render - 1;
      const lastY = h - v.offset_y_render - 1;
      expect(v.cell_at(lastX, lastY)).toMatchObject({ x: v.columns - 1, y: v.rows - 1 });
      expect(v.cell_at(lastX, v.offset_y_render + 1)).not.toBeNull();
      expect(v.cell_at(w - v.offset_x_render + 1, 10)).toBeNull();
      expect(v.cell_at(10, h - v.offset_y_render + 1)).toBeNull();
      expect(v.pan_cell_at(w / 2, h - v.offset_y_render - 1)).not.toBeNull();
      expect(v.pan_cell_at(w / 2, h - v.offset_y_render + 1)).toBeNull();
    });

    it(`pans proportionally to each axis (${name})`, () =>
    {
      const v = new Viewport(10, w, h);
      const dx = Math.max(1, Math.floor(v.columns / 10));
      const dy = Math.max(1, Math.floor(v.rows / 10));
      v.move_offset('a'); expect(v.offset_x).toBe(dx);
      v.move_offset('d'); expect(v.offset_x).toBe(0);
      v.move_offset('w'); expect(v.offset_y).toBe(dy);
      v.move_offset('s'); expect(v.offset_y).toBe(0);
    });
  }

  it('drags consistently on a portrait canvas below the old width bound', () =>
  {
    const v = new Viewport(50, 500, 1000);
    v.save_click(100, 800);
    expect(v.saved_click.y).toBe(16);
    expect(v.resolve_saved_click(200, 900)).toBe(true);
    expect(v.offset_y).toBe(2);
  });
});

describe('Click and pan share one conversion', () =>
{
  it('a drag inside one visible cell does not pan (1920x1080)', () =>
  {
    const v = new Viewport(50, 1920, 1080);
    expect(v.offset_x_render).toBe(10);
    v.save_click(45, 45);
    expect(v.resolve_saved_click(55, 55)).toBe(true);
    expect(v.offset_x).toBe(0);
    expect(v.offset_y).toBe(0);
  });

  it('cell_at and pan_cell_at agree on every sampled point', () =>
  {
    const v = new Viewport(50, 1920, 1080);
    for(let x = 5; x < 1920; x += 37)
      for(let y = 5; y < 1080; y += 41)
        expect(v.pan_cell_at(x, y)).toEqual(v.cell_at(x, y));
  });
});
