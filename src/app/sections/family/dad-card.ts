import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { XsCardComponent } from '@xtnd-dynamics/xsite-ui';
import { GameService, EASTER_EGGS } from '../../shared/services/game.service';

/**
 * "Dad" card. Five clicks trigger the hygge candle easter egg.
 */
@Component({
  selector: 'cozy-dad-card',
  templateUrl: './dad-card.html',
  styleUrl: './dad-card.scss',
  imports: [XsCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DadCard {
  private readonly game = inject(GameService);

  protected readonly clicks = signal(0);

  protected onClick(): void {
    const next = this.clicks() + 1;
    this.clicks.set(next);
    if (next >= 5) {
      this.clicks.set(0);
      this.game.open(EASTER_EGGS.dadHygge);
    }
  }
}
