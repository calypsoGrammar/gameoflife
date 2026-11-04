import { describe, it, expect } from 'vitest';
import { Square, count_neighbours, next_generation, LIMITS } from '../src/javascripts/life.js';

// Reference implementation: the naive rules, used to check equivalence.
function naive_step(pairs)
{
  const live = new Set(pairs.map(([x, y]) => `${x},${y}`));
  const tally = new Map();
  for(const [x, y] of pairs)
  {
    for(let dx = -1; dx <= 1; dx++) for(let dy = -1; dy <= 1; dy++)
    {
      if(dx === 0 && dy === 0) continue;
      const k = `${x + dx},${y + dy}`;
      tally.set(k, (tally.get(k) || 0) + 1);
    }
  }
  const next = [];
  for(const [k, n] of tally)
  {
    if(n === 3 || (n === 2 && live.has(k))) next.push(k);
  }
  return next.sort();
}

// Deterministic pseudo-random soup of roughly `cells` live cells.
function soup(cells, seed = 1)
{
  const side = Math.ceil(Math.sqrt(cells * 2));
  const seen = new Set();
  let s = seed;
  const rnd = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  while(seen.size < cells)
  {
    seen.add(`${Math.floor(rnd() * side) - 20},${Math.floor(rnd() * side) - 20}`);
  }
  return [...seen].map(k => k.split(',').map(Number));
}

const to_keys = (alive) => alive.map(s => `${s.x},${s.y}`).sort();

describe('equivalence with the naive rules', () =>
{
  it('matches over several generations of a random soup, including negative coordinates', () =>
  {
    let pairs = soup(300);
    let alive = pairs.map(([x, y]) => new Square(x, y, 0));
    for(let g = 0; g < 10; g++)
    {
      pairs = naive_step(pairs).map(k => k.split(',').map(Number));
      alive = next_generation(alive).alive;
      expect(to_keys(alive)).toEqual(pairs.map(([x, y]) => `${x},${y}`).sort());
    }
  });
});

// Documented bound: LIMITS.max_cells (100,000) imported cells. Measured on a
// random soup: about 1s for the first generation and 0.2-0.4s once warm.
// The absolute ceilings below are about 10x measured time so slower CI runners
// do not fail them; a quadratic step at the cap would take far longer. The
// ratio tests further down are the machine-independent regression check.
describe('performance fixtures', () =>
{
  const fixtures = [
    { name: 'small', cells: 100, ceiling_ms: 100 },
    { name: 'medium', cells: 1000, ceiling_ms: 250 },
    { name: 'large (import limit)', cells: LIMITS.max_cells, ceiling_ms: 4000 },
  ];
  for(const { name, cells, ceiling_ms } of fixtures)
  {
    it(`advances a ${name} pattern (${cells} cells) within ${ceiling_ms}ms per generation`, () =>
    {
      let alive = soup(cells).map(([x, y]) => new Square(x, y, 0));
      next_generation(alive); // warm-up
      const start = performance.now();
      for(let g = 0; g < 5; g++) alive = next_generation(alive).alive;
      const per_generation = (performance.now() - start) / 5;
      expect(per_generation).toBeLessThan(ceiling_ms);
    }, 120000);
  }

  it('scales roughly linearly: 10x the cells costs far less than 100x the time', () =>
  {
    const time = (cells) =>
    {
      const alive = soup(cells).map(([x, y]) => new Square(x, y, 0));
      next_generation(alive);
      const start = performance.now();
      for(let g = 0; g < 5; g++) next_generation(alive);
      return performance.now() - start;
    };
    const small = Math.max(time(1000), 0.5);
    expect(time(10000)).toBeLessThan(small * 60);
  }, 30000);
});

// Deliberately quadratic reference: every cell is compared with every other
// cell, and every candidate dead square is searched for in lists.
function count_neighbours_quadratic(alive)
{
  const near = (a, b) => Math.abs(a.x - b.x) <= 1 && Math.abs(a.y - b.y) <= 1 && !(a.x === b.x && a.y === b.y);
  const counts = alive.map(a => alive.reduce((n, b) => n + (near(a, b) ? 1 : 0), 0));
  const purgatory = [];
  for(const a of alive) for(let dx = -1; dx <= 1; dx++) for(let dy = -1; dy <= 1; dy++)
  {
    if(dx === 0 && dy === 0) continue;
    const c = { x: a.x + dx, y: a.y + dy };
    if(alive.some(b => b.x === c.x && b.y === c.y) || purgatory.some(q => q.x === c.x && q.y === c.y)) continue;
    purgatory.push({ x: c.x, y: c.y, count: alive.reduce((n, b) => n + (near(c, b) ? 1 : 0), 0) });
  }
  return { counts, purgatory };
}

describe('count_neighbours speed-up', () =>
{
  const best_of = (runs, fn) =>
  {
    let best = Infinity;
    for(let i = 0; i < runs; i++)
    {
      const start = performance.now();
      fn();
      best = Math.min(best, performance.now() - start);
    }
    return best;
  };

  it('agrees with, and is at least 10x faster than, a quadratic reference at 3,000 cells', () =>
  {
    const alive = soup(3000).map(([x, y]) => new Square(x, y, 0));
    const reference = count_neighbours_quadratic(alive);
    const purgatory = count_neighbours(alive);
    expect(alive.map(c => c.count)).toEqual(reference.counts);
    const key = (q) => `${q.x},${q.y},${q.count}`;
    expect(purgatory.map(key).sort()).toEqual(reference.purgatory.map(key).sort());
    const fast = best_of(3, () => count_neighbours(alive));
    const slow = best_of(1, () => count_neighbours_quadratic(alive));
    // Measured ratio is roughly 100x; 10x leaves wide margin.
    expect(slow / Math.max(fast, 0.05)).toBeGreaterThan(10);
  }, 60000);

  it('scales roughly linearly up to LIMITS.max_cells: 10x the cells costs under 40x the time', () =>
  {
    const time = (cells) =>
    {
      const alive = soup(cells).map(([x, y]) => new Square(x, y, 0));
      count_neighbours(alive);
      return best_of(2, () => count_neighbours(alive));
    };
    const small = Math.max(time(LIMITS.max_cells / 10), 1);
    // Measured about 14x; a quadratic algorithm would give about 100x.
    expect(time(LIMITS.max_cells)).toBeLessThan(small * 40);
  }, 60000);

  it('advances one generation of exactly LIMITS.max_cells live cells within 15s', () =>
  {
    const alive = soup(LIMITS.max_cells).map(([x, y]) => new Square(x, y, 0));
    expect(alive).toHaveLength(LIMITS.max_cells);
    const start = performance.now();
    next_generation(alive);
    expect(performance.now() - start).toBeLessThan(15000);
  }, 60000);
});

describe('import cap round trip', () =>
{
  it('exports and re-imports a pattern of LIMITS.max_cells cells within the file size limit', async () =>
  {
    const { serialize_state, parse_state } = await import('../src/javascripts/life.js');
    const alive = soup(LIMITS.max_cells).map(([x, y]) => new Square(x, y, 0));
    const text = serialize_state(alive, undefined);
    expect(text.length).toBeLessThan(LIMITS.max_file_bytes);
    expect(parse_state(text).alive).toHaveLength(LIMITS.max_cells);
  });

  it('round-trips the worst case: max cells at the coordinate extremes with full settings', async () =>
  {
    const { serialize_state, parse_state } = await import('../src/javascripts/life.js');
    const m = LIMITS.max_coordinate;
    const alive = Array.from({ length: LIMITS.max_cells }, (_, i) => new Square(-m + i, -m, 0));
    const settings = {
      generations: LIMITS.max_generations, col: '#af1919', offset_x: -m, offset_y: -m,
      square_width: LIMITS.max_square_width, frequency: String(LIMITS.max_frequency),
      grid: true, dark: false, name: 'x'.repeat(LIMITS.max_name_length), edit: false,
    };
    const text = serialize_state(alive, settings);
    expect(text.length).toBeLessThan(LIMITS.max_file_bytes);
    expect(parse_state(text).alive).toHaveLength(LIMITS.max_cells);
  });
});
