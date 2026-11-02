import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(new URL('../.github/workflows/ci.yml', import.meta.url), 'utf8');

describe('GitHub Pages deployment workflow', () =>
{
  it('runs on pushes to main', () =>
  {
    expect(workflow).toMatch(/push:\s*\n\s*branches: \[main\]/);
  });

  it('builds and uploads dist/ as the Pages artifact', () =>
  {
    expect(workflow).toContain('run: npm run build');
    expect(workflow).toMatch(/upload-pages-artifact@[\w.]+\s*\n\s*with:\s*\n\s*path: dist/);
  });

  it('deploys only after tests and build, and only from main', () =>
  {
    expect(workflow).toMatch(/deploy:\s*\n\s*if: github\.ref == 'refs\/heads\/main' && github\.event_name != 'pull_request'\s*\n\s*needs: test-and-build/);
    expect(workflow).toContain('actions/deploy-pages@');
  });

  it('grants Pages write permissions only to the deploy job', () =>
  {
    expect(workflow.match(/pages: write/g)).toHaveLength(1);
    expect(workflow.indexOf('pages: write')).toBeGreaterThan(workflow.indexOf('deploy:'));
  });
});
