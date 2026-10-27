import { describe, it, expect } from 'vitest';
import { Square, next_generation, LIMITS } from '../src/javascripts/life.js';

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

// Documented bound: LIMITS.max_cells (10,000) imported cells, and a 10,000-cell
// soup must advance a generation well inside a second. The ceilings below are
// generous (roughly 10-50x measured) so they catch quadratic regressions, not noise.
describe('performance fixtures', () =>
{
  const fixtures = [
    { name: 'small', cells: 100, ceiling_ms: 100 },
    { name: 'medium', cells: 1000, ceiling_ms: 250 },
    { name: 'large (import limit)', cells: LIMITS.max_cells, ceiling_ms: 1000 },
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
    });
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
  });
});
