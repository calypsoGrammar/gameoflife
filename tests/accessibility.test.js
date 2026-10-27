import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { Viewport } from '../src/javascripts/life.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/stylesheets/style.css', import.meta.url), 'utf8');

function attrs(tag)
{
  const out = {};
  for(const m of tag.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) out[m[1]] = m[2] ?? m[3] ?? '';
  return out;
}

// Interactive elements: start tag, attributes and text content up to the closing tag.
function interactive()
{
  const found = [];
  for(const m of html.matchAll(/<(button|input|canvas)\b([^>]*)>(?:([\s\S]*?)<\/\1>)?/g))
  {
    const a = attrs(m[2]);
    if(m[1] === 'input' && 'hidden' in a) continue;
    found.push({ tag: m[1], a, text: (m[3] || '').replace(/<[^>]*>/g, '').trim() });
  }
  return found;
}

const labels = [...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/g)]
  .map(m => ({ for: attrs(m[1]).for, text: m[2].trim() }));
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);

describe('control accessibility', () =>
{
  const controls = interactive();

  it('finds the control surface', () =>
  {
    expect(controls.length).toBeGreaterThan(20);
  });

  it('gives every interactive control an accessible name', () =>
  {
    for(const { tag, a, text } of controls)
    {
      const labelled = a['aria-label'] || text || labels.some(l => l.for === a.id && l.text);
      expect(labelled, `${tag}#${a.id} has no accessible name`).toBeTruthy();
    }
  });

  it('has unique ids and label[for] pointing at existing controls', () =>
  {
    expect(new Set(ids).size).toBe(ids.length);
    for(const l of labels) expect(ids, `label "${l.text}" targets missing #${l.for}`).toContain(l.for);
  });

  it('associates the show grid label with the grid button, not frequency', () =>
  {
    expect(labels.find(l => l.text === 'show grid').for).toBe('GRID');
    expect(labels.filter(l => l.for === 'FREQUENCY')).toHaveLength(1);
  });

  it('exposes toggle state on the toggle buttons', () =>
  {
    for(const id of ['GRID', 'THEME', 'HIDE_CONTROLS'])
      expect(controls.find(c => c.a.id === id).a['aria-pressed']).toMatch(/^(true|false)$/);
    expect(controls.find(c => c.a.id === 'DOWN').a['aria-expanded']).toBeDefined();
  });

  it('makes the canvas focusable, named and described', () =>
  {
    const canvas = controls.find(c => c.tag === 'canvas').a;
    expect(canvas.tabindex).toBe('0');
    expect(canvas['aria-label']).toBeTruthy();
    expect(ids).toContain(canvas['aria-describedby']);
    expect(html).toMatch(/id="CANVAS_HELP"[^>]*>[^<]*Enter or Space/);
  });

  it('provides a polite live status region and labelled counters', () =>
  {
    expect(html).toMatch(/id="STATUS"[^>]*aria-live="polite"/);
    expect(html).toMatch(/id="COUNT"[^>]*aria-label="Generation"/);
    expect(html).toMatch(/id="LOC"[^>]*aria-label=/);
  });

  it('never removes the focus indicator', () =>
  {
    expect(css).toMatch(/:focus-visible/);
    expect(html + css).not.toMatch(/outline-none|outline:\s*none|focus:outline-0/);
  });
});

describe('keyboard cell navigation', () =>
{
  it('scrolls the viewport just enough to reveal the cursor cell', () =>
  {
    const vp = new Viewport(50, 500, 500); // 10 x 10 cells
    vp.scroll_to_cell(3, 3);
    expect([vp.offset_x, vp.offset_y]).toEqual([0, 0]);
    vp.scroll_to_cell(10, 0);
    expect(vp.offset_x).toBe(-1);
    vp.scroll_to_cell(-2, 12);
    expect([vp.offset_x, vp.offset_y]).toEqual([2, -3]);
    for(const [x, y] of [[10, 0], [-2, 12], [4, 4]])
    {
      vp.scroll_to_cell(x, y);
      expect(x).toBeGreaterThanOrEqual(-vp.offset_x);
      expect(x).toBeLessThan(-vp.offset_x + vp.columns);
      expect(y).toBeGreaterThanOrEqual(-vp.offset_y);
      expect(y).toBeLessThan(-vp.offset_y + vp.rows);
    }
  });
});
