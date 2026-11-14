import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const ci = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');
const deploy = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');

describe('GitHub Pages deployment workflows', () =>
{
  it('CI tests and builds on pull requests and main without publishing', () =>
  {
    expect(ci).toMatch(/push:\s*\n\s*branches: \[main\]/);
    expect(ci).toContain('run: npm test');
    expect(ci).toContain('run: npm run build');
    expect(ci).not.toMatch(/pages|deploy|id-token/);
  });

  it('publishes only when run by hand, through the shared Pages workflow', () =>
  {
    expect(deploy).toMatch(/^on:\s*\n\s*workflow_dispatch:/m);
    expect(deploy).not.toMatch(/^\s*(push|pull_request|schedule):/m);
    expect(deploy).toMatch(/uses: calypsoGrammar\/deploy-workflows\/\.github\/workflows\/github-pages\.yml@v\d+/);
  });

  it('requires the CI job and publishes the fresh dist/ build', () =>
  {
    expect(deploy).toMatch(/required_checks: \|\s*\n\s*test-and-build\s*\n/);
    expect(deploy).toContain('npm run build');
    expect(deploy).toMatch(/site_path: dist/);
  });
});
