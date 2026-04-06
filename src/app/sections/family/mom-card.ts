import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { XsCardComponent } from '@xsite/ui';
import { GameService, EASTER_EGGS } from '../../shared/services/game.service';

/**
 * "Mom" card. Five clicks trigger the karaoke easter egg.
 * The illustration is an inline SVG of a cartoon mom with a mic.
 */
@Component({
  selector: 'cozy-mom-card',
  templateUrl: './mom-card.html',
  styleUrl: './mom-card.scss',
  imports: [XsCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MomCard {
  private readonly game = inject(GameService);

  protected readonly clicks = signal(0);

  protected onClick(): void {
    const next = this.clicks() + 1;
    this.clicks.set(next);
    if (next >= 5) {
      this.clicks.set(0);
      this.game.open(EASTER_EGGS.momKaraoke);
    }
  }
}
