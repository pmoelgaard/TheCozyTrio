import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';

/**
 * Peek-a-boo: a baby-face SVG hides behind two hands. Click anywhere
 * on the face area and the hands fly open; after ~1s they close again.
 * Six successful opens = won.
 */
@Component({
  selector: 'cozy-peek-a-boo',
  templateUrl: './peek-a-boo.html',
  styleUrl: './peek-a-boo.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeekABoo {
  readonly won = output<void>();

  protected readonly opens = signal(0);
  protected readonly showing = signal(false);

  protected peek(): void {
    if (this.showing()) return;
    this.showing.set(true);
    const next = this.opens() + 1;
    this.opens.set(next);
    setTimeout(() => this.showing.set(false), 1100);
    if (next >= 6) {
      setTimeout(() => this.won.emit(), 300);
    }
  }
}
