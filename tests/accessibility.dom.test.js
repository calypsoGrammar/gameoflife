// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import axe from 'axe-core';
import { resolve } from 'node:path';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

// jsdom has no canvas; a permissive 2d context stub is enough for the UI code.
const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => ({ width: 0 })), set: (t, k, v) => ((t[k] = v), true) });
HTMLCanvasElement.prototype.getContext = () => ctx;

const tick = (ms = 60) => new Promise(r => setTimeout(r, ms));

beforeAll(async () =>
{
  document.documentElement.lang = 'en';
  document.title = 'Game of Life';
  document.body.innerHTML = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1].replace(/<script[\s\S]*?<\/script>/g, '');
  document.body.setAttribute('x-data', '{ menu: true }');
  await import('../src/javascripts/main.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await tick();
});

describe('rendered DOM accessibility', () =>
{
  it('has no axe violations for names, roles and ARIA usage', async () =>
  {
    const result = await axe.run(document.documentElement, {
      rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
    });
    const summary = result.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`);
    expect(summary).toEqual([]);
  });

  it('mirrors toggle state into aria-pressed at runtime', async () =>
  {
    const grid = document.getElementById('GRID');
    const before = grid.getAttribute('aria-pressed');
    grid.click();
    expect(grid.getAttribute('aria-pressed')).toBe(before === 'true' ? 'false' : 'true');
    grid.click();
    expect(grid.getAttribute('aria-pressed')).toBe(before);
  });

  it('moves focus between play and pause', () =>
  {
    const play = document.getElementById('PLAY');
    const pause = document.getElementById('PAUSE');
    play.focus();
    play.click();
    expect(pause.style.display).not.toBe('none');
    expect(document.activeElement).toBe(pause);
    pause.click();
    expect(document.activeElement).toBe(play);
  });

  it('keeps the canvas keyboard focusable', () =>
  {
    const canvas = document.getElementById('CANVAS');
    canvas.focus();
    expect(document.activeElement).toBe(canvas);
  });
});
