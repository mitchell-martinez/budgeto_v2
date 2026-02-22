import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative } from 'path';
import { describe, expect, it } from 'vitest';

/**
 * These tests enforce that focus-visible outline styles are defined ONLY in the
 * global app.css file and NOT overridden in individual component SCSS modules.
 *
 * The canonical focus ring is:
 *   Dark mode:  2px solid #ffffff, offset 2px
 *   Light mode: 2px solid #000000, offset 2px
 *
 * Defined once in src/app.css and inherited by all interactive elements.
 */

const SRC_DIR = join(__dirname, '..', '..');
const APP_CSS_PATH = join(SRC_DIR, 'app.css');

/** Recursively collect all .scss files under a directory */
const collectScssFiles = (dir: string): string[] => {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectScssFiles(full));
    } else if (full.endsWith('.module.scss')) {
      results.push(full);
    }
  }
  return results;
};

/**
 * Checks whether a CSS/SCSS string contains `outline` or `outline-offset`
 * declarations inside a `:focus-visible` rule block. Allows `z-index` or
 * other non-outline properties inside :focus-visible.
 */
const findFocusVisibleOutlineOverrides = (
  content: string,
): { line: number; text: string }[] => {
  const lines = content.split('\n');
  const violations: { line: number; text: string }[] = [];
  let insideFocusVisible = false;
  let braceDepth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes(':focus-visible') || line.includes(':focus ')) {
      insideFocusVisible = true;
      braceDepth = 0;
    }

    if (insideFocusVisible) {
      for (const char of line) {
        if (char === '{') {
          braceDepth++;
        }
        if (char === '}') {
          braceDepth--;
        }
      }

      const trimmed = line.trim();
      if (
        trimmed.match(/^\s*outline\s*:/) ||
        trimmed.match(/^\s*outline-offset\s*:/)
      ) {
        violations.push({ line: i + 1, text: trimmed });
      }

      if (braceDepth <= 0) {
        insideFocusVisible = false;
      }
    }
  }

  return violations;
};

describe('Global focus-visible consistency', () => {
  describe('app.css defines the canonical focus ring', () => {
    const appCss = readFileSync(APP_CSS_PATH, 'utf-8');

    it('defines a dark-mode :focus-visible with 2px solid #ffffff', () => {
      expect(appCss).toContain(':focus-visible');
      expect(appCss).toMatch(/outline:\s*2px\s+solid\s+#ffffff/i);
    });

    it('defines a light-mode .light :focus-visible with 2px solid #000000', () => {
      expect(appCss).toMatch(/\.light\s+:focus-visible/);
      expect(appCss).toMatch(/outline:\s*2px\s+solid\s+#000000/i);
    });

    it('sets outline-offset to 2px for both themes', () => {
      const offsetMatches = appCss.match(/outline-offset:\s*(\d+)px/g) ?? [];
      expect(offsetMatches.length).toBeGreaterThanOrEqual(2);
      for (const match of offsetMatches) {
        expect(match).toContain('2px');
      }
    });
  });

  describe('no component SCSS module overrides focus-visible outline', () => {
    const scssFiles = collectScssFiles(SRC_DIR);

    // Sanity: make sure we actually found SCSS files
    it('finds at least 5 SCSS module files to audit', () => {
      expect(scssFiles.length).toBeGreaterThanOrEqual(5);
    });

    for (const filePath of scssFiles) {
      const rel = relative(SRC_DIR, filePath);

      it(`${rel} does not override :focus-visible outline`, () => {
        const content = readFileSync(filePath, 'utf-8');
        const violations = findFocusVisibleOutlineOverrides(content);

        if (violations.length > 0) {
          const details = violations
            .map((v) => `  Line ${v.line}: ${v.text}`)
            .join('\n');

          expect.fail(
            `Found focus-visible outline override(s) in ${rel}:\n${details}\n\n` +
              'Focus outlines should be defined only in app.css. ' +
              'Remove these overrides so the global rule applies consistently.',
          );
        }
      });
    }
  });
});
