// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import axe from 'axe-core';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

// jsdom has no canvas; a permissive 2d context stub is enough for the UI code.
const ctx = new Proxy({}, { get: (t, k) => (k in t ? t[k] : () => ({ width: 0 })), set: (t, k, v) => ((t[k] = v), true) });
HTMLCanvasElement.prototype.getContext = () => ctx;

const tick = (ms = 80) => new Promise(r => setTimeout(r, ms));
const $ = id => document.getElementById(id);
const shown = el => getComputedStyle(el).display !== 'none';

function copyAttrs(from, to)
{
  for(const { name, value } of from.attributes) to.setAttribute(name, value);
}

function nameOf(id)
{
  axe.setup(document.documentElement);
  try
  {
    // Hidden controls (PAUSE, DOWN) are named too; buttons also take their name from label[for].
    const { text } = axe.commons;
    const el = $(id);
    const own = text.accessibleText(el, { includeHidden: true }).trim();
    return own || text.labelText(axe.utils.getNodeFromTree(el)).trim();
  }
  finally { axe.teardown(); }
}

async function audit()
{
  const result = await axe.run(document.documentElement, { rules: { 'color-contrast': { enabled: false }, region: { enabled: false } } });
  return result.violations.map(v => `${v.id}: ${v.nodes.map(n => n.target).join(', ')}`);
}

beforeAll(async () =>
{
  // Carry the real document over (html and body attributes, head, body), minus scripts.
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  parsed.querySelectorAll('script, link').forEach(n => n.remove());
  copyAttrs(parsed.documentElement, document.documentElement);
  copyAttrs(parsed.body, document.body);
  document.head.innerHTML = parsed.head.innerHTML;
  document.body.innerHTML = parsed.body.innerHTML;
  await import('../src/javascripts/main.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
  await tick();
});

describe('rendered DOM accessibility', () =>
{
  it('has no axe violations in the initial state (including lang, title and viewport)', async () =>
  {
    expect(await audit()).toEqual([]);
  });

  // Expected computed names, including controls hidden in the initial state.
  const names = {
    PLAY: 'Play simulation',
    PAUSE: 'Pause simulation',
    STEP: 'Advance one generation',
    RESET: 'Reset board',
    UP: 'Hide menu',
    DOWN: 'Show menu',
    GRID: 'show grid',
    THEME: 'theme',
    HIDE_CONTROLS: 'controls',
    FREQUENCY: 'frequency',
    COL: 'colour',
    NAME: 'download file name',
  };

  it.each(Object.entries(names))('computes the accessible name of #%s', (id, expected) =>
  {
    expect(nameOf(id)).toBe(expected);
  });

  it('mirrors toggle state into aria-pressed at runtime', () =>
  {
    for(const id of ['GRID', 'THEME'])
    {
      const button = $(id);
      const before = button.getAttribute('aria-pressed');
      button.click();
      expect(button.getAttribute('aria-pressed'), id).toBe(before === 'true' ? 'false' : 'true');
      button.click();
      expect(button.getAttribute('aria-pressed'), id).toBe(before);
    }
  });

  it('keeps the controls toggle in step with the controls panel', () =>
  {
    const toggle = $('HIDE_CONTROLS');
    const panel = $('CONTROLS');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(shown(panel)).toBe(true);
    toggle.click();
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(shown(panel)).toBe(false);
    toggle.click();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(shown(panel)).toBe(true);
  });

  it('moves focus between play and pause, always onto the visible one', () =>
  {
    const play = $('PLAY');
    const pause = $('PAUSE');
    play.focus();
    play.click();
    expect(shown(pause)).toBe(true);
    expect(shown(play)).toBe(false);
    expect(document.activeElement).toBe(pause);
    pause.click();
    expect(shown(play)).toBe(true);
    expect(shown(pause)).toBe(false);
    expect(document.activeElement).toBe(play);
  });

  it('keeps the canvas keyboard focusable', () =>
  {
    $('CANVAS').focus();
    expect(document.activeElement).toBe($('CANVAS'));
  });

  it('updates aria-expanded and hands focus over when the menu is toggled', async () =>
  {
    const up = $('UP');
    const down = $('DOWN');
    up.focus();
    up.click();
    await tick();
    expect(up.getAttribute('aria-expanded')).toBe('false');
    expect(down.getAttribute('aria-expanded')).toBe('false');
    expect(shown(down)).toBe(true);
    expect(document.activeElement).toBe(down);
    expect(nameOf('DOWN')).toBe('Show menu');
    expect(await audit()).toEqual([]);

    down.click();
    await tick();
    expect(up.getAttribute('aria-expanded')).toBe('true');
    expect(down.getAttribute('aria-expanded')).toBe('true');
    expect(shown(up)).toBe(true);
    expect(document.activeElement).toBe(up);
  });

  it('has no axe violations while the simulation is running', async () =>
  {
    $('PLAY').click();
    await tick();
    expect(shown($('PAUSE'))).toBe(true);
    expect(await audit()).toEqual([]);
    $('PAUSE').click();
  });
});
