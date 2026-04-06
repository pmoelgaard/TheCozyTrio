import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InViewDirective } from '@xtnd-dynamics/xsite-core';

export interface CultureBlendCard {
  readonly id: string;
  readonly category: string;
  readonly ph: { readonly title: string; readonly glyph: string; readonly body: string };
  readonly dk: { readonly title: string; readonly glyph: string; readonly body: string };
  readonly blend: string;
}

/**
 * Six 3D flip-cards showing a blend of Filipino and Danish traditions.
 * Hover (desktop) or tap (touch) flips each card to reveal the "blend"
 * on the back.
 */
@Component({
  selector: 'cozy-culture-blend',
  templateUrl: './culture-blend.html',
  styleUrl: './culture-blend.scss',
  imports: [InViewDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CultureBlend {
  protected readonly cards: readonly CultureBlendCard[] = [
    {
      id: 'food',
      category: 'Food',
      ph: { title: 'Adobo', glyph: '🍛', body: 'Slow-braised, tangy, umami-packed.' },
      dk: { title: 'Frikadeller', glyph: '🥩', body: 'Pan-fried pork meatballs, pure comfort.' },
      blend: '"Adobo-frikadeller" Sunday dinner — soy + bay leaves meet rye bread.',
    },
    {
      id: 'christmas',
      category: 'Christmas',
      ph: { title: 'Noche Buena', glyph: '🎄', body: 'Midnight feast after Simbang Gabi.' },
      dk: { title: 'Juleaften', glyph: '🕯️', body: 'Dance around the tree at 6pm sharp.' },
      blend: 'We do both. Two Christmases, zero complaints.',
    },
    {
      id: 'coffee',
      category: 'Morning',
      ph: { title: 'Kapeng Barako', glyph: '☕', body: 'Strong, earthy, served with pandesal.' },
      dk: { title: 'Kaffehygge', glyph: '🫖', body: 'Slow mornings, candlelit, always a refill.' },
      blend: 'Barako in a Danish mug. Hygge, tropical edition.',
    },
    {
      id: 'lullaby',
      category: 'Bedtime',
      ph: { title: 'Ili-ili Tulog Anay', glyph: '🎶', body: 'A soft Visayan lullaby.' },
      dk: { title: 'Se, den lille kattekilling', glyph: '🐱', body: 'A playful Danish nursery tune.' },
      blend: 'Baby gets both. Trilingual dreams already.',
    },
    {
      id: 'love',
      category: 'Words',
      ph: { title: 'Mahal kita', glyph: '💗', body: 'Filipino for "I love you".' },
      dk: { title: 'Jeg elsker dig', glyph: '💙', body: 'Danish for "I love you".' },
      blend: 'Said interchangeably, both melt the heart equally.',
    },
    {
      id: 'weather',
      category: 'Weather',
      ph: { title: 'Sunshine & Monsoons', glyph: '☀️', body: 'Warm year-round.' },
      dk: { title: 'Snow & Cozy', glyph: '❄️', body: 'Four seasons, lots of candles.' },
      blend: 'One wardrobe for everything. Always prepared.',
    },
  ];

  /** Tracks which cards are manually flipped (for touch devices). */
  protected readonly flipped = signal<ReadonlySet<string>>(new Set());

  protected toggle(id: string): void {
    const next = new Set(this.flipped());
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    this.flipped.set(next);
  }

  protected isFlipped(id: string): boolean {
    return this.flipped().has(id);
  }
}
