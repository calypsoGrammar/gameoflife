import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { existsSync } from 'node:fs';
import { createServer } from 'vite';

const PW = '/usr/local/lib/node_modules/playwright/index.mjs';
const available = existsSync(PW);

describe.skipIf(!available)('runtime accessibility (browser)', () =>
{
  let server, browser, page;

  beforeAll(async () =>
  {
    process.env.PLAYWRIGHT_BROWSERS_PATH ??= '/usr/local/share/ms-playwright';
    const { chromium } = await import(PW);
    server = await createServer({ server: { port: 0 }, logLevel: 'silent' });
    await server.listen();
    const url = server.resolvedUrls.local[0];
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(url);
    await page.waitForFunction(() => window.gol);
  }, 60000);

  afterAll(async () =>
  {
    await browser?.close();
    await server?.close();
  });

  it('toggles a cell from the keyboard and announces it', async () =>
  {
    await page.focus('#CANVAS');
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => window.gol.alive.length)).toBe(1);
    await page.waitForFunction(() => document.getElementById('STATUS').textContent.includes('born'));
    await page.keyboard.press('Space');
    expect(await page.evaluate(() => window.gol.alive.length)).toBe(0);
    await page.waitForFunction(() => document.getElementById('STATUS').textContent.includes('removed'));
  });

  it('keeps aria-pressed in sync after grid toggle and reset', async () =>
  {
    await page.click('#GRID');
    expect(await page.getAttribute('#GRID', 'aria-pressed')).toBe('false');
    await page.click('#RESET');
    expect(await page.getAttribute('#GRID', 'aria-pressed')).toBe('true');
  });

  it('keeps focus on the visible disclosure button', async () =>
  {
    await page.focus('#UP');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement.id === 'DOWN');
    expect(await page.getAttribute('#DOWN', 'aria-expanded')).toBe('false');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement.id === 'UP');
  });
});
