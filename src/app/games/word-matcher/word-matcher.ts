import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
} from '@angular/core';

interface WordPair {
  readonly key: string;
  readonly english: string;
  readonly tagalog: string;
  readonly danish: string;
}

interface Tile {
  readonly id: string;
  readonly pairKey: string;
  readonly label: string;
  readonly lang: 'tl' | 'da';
}

const PAIRS: readonly WordPair[] = [
  { key: 'love',   english: 'Love',          tagalog: 'Mahal',    danish: 'Kærlighed' },
  { key: 'family', english: 'Family',        tagalog: 'Pamilya',  danish: 'Familie' },
  { key: 'home',   english: 'Home',          tagalog: 'Tahanan',  danish: 'Hjem' },
  { key: 'baby',   english: 'Baby',          tagalog: 'Sanggol',  danish: 'Baby' },
  { key: 'cozy',   english: 'Cozy',          tagalog: 'Komportable', danish: 'Hyggelig' },
];

/**
 * Word Matcher: English words on the left, Tagalog+Danish jumbled on
 * the right. Click an English row, then a foreign word to attempt a
 * match. Match both languages for each word to win.
 */
@Component({
  selector: 'cozy-word-matcher',
  templateUrl: './word-matcher.html',
  styleUrl: './word-matcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordMatcher {
  readonly won = output<void>();

  protected readonly pairs = PAIRS;

  protected readonly tiles = signal<readonly Tile[]>(this.buildTiles());
  protected readonly selectedPair = signal<string | null>(null);
  protected readonly matched = signal<ReadonlySet<string>>(new Set()); // tile ids
  protected readonly wrong = signal<string | null>(null); // tile id briefly flashed red

  protected readonly done = computed(
    () => this.matched().size === this.tiles().length,
  );

  private buildTiles(): Tile[] {
    const list: Tile[] = [];
    for (const p of PAIRS) {
      list.push({ id: `${p.key}-tl`, pairKey: p.key, label: p.tagalog, lang: 'tl' });
      list.push({ id: `${p.key}-da`, pairKey: p.key, label: p.danish,  lang: 'da' });
    }
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  protected selectPair(key: string): void {
    if (this.selectedPair() === key) {
      this.selectedPair.set(null);
    } else {
      this.selectedPair.set(key);
    }
  }

  protected tryMatch(tile: Tile): void {
    const sel = this.selectedPair();
    if (!sel) return;
    if (this.matched().has(tile.id)) return;
    if (tile.pairKey === sel) {
      const next = new Set(this.matched());
      next.add(tile.id);
      this.matched.set(next);
      // Auto-clear selection once both language tiles for this pair are matched.
      const stillPending = this.tiles().some(
        (t) => t.pairKey === sel && !next.has(t.id),
      );
      if (!stillPending) {
        this.selectedPair.set(null);
      }
      if (this.done()) setTimeout(() => this.won.emit(), 400);
    } else {
      this.wrong.set(tile.id);
      setTimeout(() => this.wrong.set(null), 500);
    }
  }

  protected isMatched(id: string): boolean {
    return this.matched().has(id);
  }

  protected pairMatched(key: string): boolean {
    return this.tiles()
      .filter((t) => t.pairKey === key)
      .every((t) => this.matched().has(t.id));
  }

  protected reset(): void {
    this.tiles.set(this.buildTiles());
    this.selectedPair.set(null);
    this.matched.set(new Set());
  }
}
