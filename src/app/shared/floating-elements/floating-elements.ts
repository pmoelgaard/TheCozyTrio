import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * Ambient decoration: a layer of absolutely-positioned emoji/SVG
 * glyphs that drift and pulse behind a section. Pure CSS animations
 * (compositor-threaded), seeded from the input count so the positions
 * are deterministic per render.
 *
 * The hosting section should be `position: relative` for this to clip.
 */
export interface FloatingItem {
  readonly glyph: string;
  readonly top: string;
  readonly left: string;
  readonly size: string;
  readonly delay: string;
  readonly duration: string;
  readonly drift: string;
}

@Component({
  selector: 'cozy-floating-elements',
  templateUrl: './floating-elements.html',
  styleUrl: './floating-elements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloatingElements {
  /** How many glyphs to render. */
  readonly count = input<number>(12);

  /**
   * Which glyphs to pick from. Defaults to a mix of hearts and stars
   * that work in both themes. Callers can pass e.g. ['🌸', '🌺'] for
   * a girl-theme section or ['⭐', '✨'] for a hero.
   */
  readonly glyphs = input<readonly string[]>([
    '💙',
    '💖',
    '⭐',
    '✨',
    '🌟',
  ]);

  /** Deterministic pseudo-random layout — memoized per input change. */
  protected readonly items = computed<readonly FloatingItem[]>(() => {
    const n = this.count();
    const pool = this.glyphs();
    const out: FloatingItem[] = [];
    // A tiny mulberry32 PRNG seeded from n + pool length keeps positions
    // stable across re-renders without importing a dep.
    let seed = (n * 2654435761) ^ (pool.length * 40503);
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < n; i++) {
      const glyph = pool[Math.floor(rand() * pool.length)];
      out.push({
        glyph,
        top: `${Math.round(rand() * 100)}%`,
        left: `${Math.round(rand() * 100)}%`,
        size: `${Math.round(16 + rand() * 24)}px`,
        delay: `${(rand() * 6).toFixed(2)}s`,
        duration: `${(6 + rand() * 6).toFixed(2)}s`,
        drift: `${Math.round(rand() * 40 - 20)}px`,
      });
    }
    return out;
  });
}
