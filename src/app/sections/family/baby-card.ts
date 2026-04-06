import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { XsCardComponent } from '@xtnd-dynamics/xsite-ui';
import { GameService, EASTER_EGGS } from '../../shared/services/game.service';

/**
 * "Baby" card. A single click opens the Peek-a-boo dialog.
 */
@Component({
  selector: 'cozy-baby-card',
  templateUrl: './baby-card.html',
  styleUrl: './baby-card.scss',
  imports: [XsCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BabyCard {
  private readonly game = inject(GameService);

  protected onClick(): void {
    this.game.open(EASTER_EGGS.peekABoo);
  }
}
