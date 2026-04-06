import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { StorageService } from '@xtnd-dynamics/xsite-core';

/**
 * Names of the individual easter eggs scattered through the page.
 * Using a const-object pattern (instead of a TS enum) so each value
 * is also usable as a localStorage key and a CSS hook.
 */
export const EASTER_EGGS = {
  peekABoo: 'peek-a-boo',
  momKaraoke: 'mom-karaoke',
  dadHygge: 'dad-hygge',
  catchPacifier: 'catch-pacifier',
  memoryMatch: 'memory-match',
  wordMatcher: 'word-matcher',
  konami: 'konami',
} as const;
export type EasterEggName = (typeof EASTER_EGGS)[keyof typeof EASTER_EGGS];

const STORAGE_KEYS = {
  discovered: 'cozy:eggs-discovered',
  heartsFound: 'cozy:hearts-found',
  pacifierHighScore: 'cozy:pacifier-high-score',
  memoryMatchBestMoves: 'cozy:memory-best-moves',
} as const;

/**
 * Central game / easter-egg state.
 *
 * Deliberately thin: XSite's `StorageService` already gives us
 * signal-bound localStorage, so we just read through it and expose
 * convenience `setFoo()` setters that persist via `setLocal()`.
 */
@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly storage = inject(StorageService);

  /** Set of easter-egg names that have been discovered at least once. */
  private readonly _discovered: Signal<readonly EasterEggName[] | null> =
    this.storage.local<readonly EasterEggName[]>(STORAGE_KEYS.discovered);

  readonly discovered = computed<ReadonlySet<EasterEggName>>(() => {
    const raw = this._discovered();
    return new Set<EasterEggName>(raw ?? []);
  });

  /** How many of the 10 hidden hearts have been found (array of their ids). */
  private readonly _heartsFound: Signal<readonly string[] | null> =
    this.storage.local<readonly string[]>(STORAGE_KEYS.heartsFound);

  readonly heartsFound = computed<ReadonlySet<string>>(() => {
    return new Set(this._heartsFound() ?? []);
  });

  readonly heartsFoundCount = computed(() => this.heartsFound().size);

  /** Best Catch-the-Pacifier high score. */
  readonly pacifierHighScore = this.storage.local<number>(
    STORAGE_KEYS.pacifierHighScore,
  );

  /** Best Memory Match score (fewest moves). */
  readonly memoryMatchBestMoves = this.storage.local<number>(
    STORAGE_KEYS.memoryMatchBestMoves,
  );

  /**
   * Transient "which easter egg is currently being triggered" signal —
   * lets any component (e.g. App) open the corresponding dialog
   * without having to plumb state through every parent.
   */
  readonly activeEgg = signal<EasterEggName | null>(null);

  /** Mark an easter egg as discovered. Idempotent. */
  discover(name: EasterEggName): void {
    const current = new Set(this._discovered() ?? []);
    if (current.has(name)) return;
    current.add(name);
    this.storage.setLocal(STORAGE_KEYS.discovered, Array.from(current));
  }

  /** Open one of the game modals. Persists discovery automatically. */
  open(name: EasterEggName): void {
    this.discover(name);
    this.activeEgg.set(name);
  }

  close(): void {
    this.activeEgg.set(null);
  }

  /** Record that a hidden heart has been found. */
  findHeart(id: string): void {
    const current = new Set(this._heartsFound() ?? []);
    if (current.has(id)) return;
    current.add(id);
    this.storage.setLocal(STORAGE_KEYS.heartsFound, Array.from(current));
  }

  /** Update the Catch-the-Pacifier high score if new score beats previous. */
  submitPacifierScore(score: number): void {
    const best = this.pacifierHighScore() ?? 0;
    if (score > best) {
      this.storage.setLocal(STORAGE_KEYS.pacifierHighScore, score);
    }
  }

  /** Update the Memory Match best (lower is better). */
  submitMemoryMatchMoves(moves: number): void {
    const best = this.memoryMatchBestMoves();
    if (best == null || moves < best) {
      this.storage.setLocal(STORAGE_KEYS.memoryMatchBestMoves, moves);
    }
  }
}
