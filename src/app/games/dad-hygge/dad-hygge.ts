import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * "Dad hygge" overlay: a candlelit scene with warm amber tones,
 * flickering flame, coffee steam, and a blanket-wrapped dad.
 * Triggered by 5 clicks on the Dad card.
 */
@Component({
  selector: 'cozy-dad-hygge',
  templateUrl: './dad-hygge.html',
  styleUrl: './dad-hygge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DadHygge {
  readonly won = output<void>();
}
