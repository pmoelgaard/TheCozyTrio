import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  output,
  signal,
} from '@angular/core';
import { GameService } from '../../shared/services/game.service';

interface MemoryCard {
  readonly id: number;
  readonly glyph: string;
  readonly pairKey: string;
  readonly flipped: boolean;
  readonly matched: boolean;
}

const GLYPHS = ['🍼', '🧸', '🦄', '🌙', '⭐', '💙'] as const;

/**
 * 6-pair memory match (12 cards, 4×3). Tracks move count; updates
 * GameService.memoryMatchBestMoves on completion.
 */
@Component({
  selector: 'cozy-memory-match',
  templateUrl: './memory-match.html',
  styleUrl: './memory-match.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryMatch {
  private readonly game = inject(GameService);

  readonly won = output<void>();

  protected readonly cards = signal<readonly MemoryCard[]>(this.build());
  protected readonly moves = signal(0);
  protected readonly firstPick = signal<number | null>(null);
  protected readonly locked = signal(false);
  protected readonly best = this.game.memoryMatchBestMoves;

  protected readonly matchedCount = computed(
    () => this.cards().filter((c) => c.matched).length,
  );

  protected readonly finished = computed(() => this.matchedCount() === 12);

  private build(): MemoryCard[] {
    const deck: MemoryCard[] = [];
    let id = 0;
    for (const g of GLYPHS) {
      deck.push({ id: id++, glyph: g, pairKey: g, flipped: false, matched: false });
      deck.push({ id: id++, glyph: g, pairKey: g, flipped: false, matched: false });
    }
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  protected flip(id: number): void {
    if (this.locked()) return;
    const cards = this.cards();
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    const updated = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    this.cards.set(updated);

    const first = this.firstPick();
    if (first == null) {
      this.firstPick.set(id);
      return;
    }

    this.moves.set(this.moves() + 1);
    const firstCard = updated.find((c) => c.id === first);
    if (firstCard && firstCard.pairKey === card.pairKey) {
      // Match!
      this.cards.set(
        updated.map((c) =>
          c.id === first || c.id === id ? { ...c, matched: true } : c,
        ),
      );
      this.firstPick.set(null);
      if (this.cards().every((c) => c.matched)) {
        this.game.submitMemoryMatchMoves(this.moves());
        setTimeout(() => this.won.emit(), 500);
      }
    } else {
      // Miss — flip both back after a moment.
      this.locked.set(true);
      setTimeout(() => {
        this.cards.set(
          this.cards().map((c) =>
            c.id === first || c.id === id ? { ...c, flipped: false } : c,
          ),
        );
        this.firstPick.set(null);
        this.locked.set(false);
      }, 900);
    }
  }

  protected reset(): void {
    this.cards.set(this.build());
    this.moves.set(0);
    this.firstPick.set(null);
    this.locked.set(false);
  }
}
