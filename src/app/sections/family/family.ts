import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InViewDirective } from '@xsite/core';
import { MomCard } from './mom-card';
import { DadCard } from './dad-card';
import { BabyCard } from './baby-card';

/**
 * Family section — the three cards that introduce Mom, Dad, and Baby.
 * Scroll-reveal via xsInView; each card staggered via CSS --i.
 */
@Component({
  selector: 'cozy-family',
  templateUrl: './family.html',
  styleUrl: './family.scss',
  imports: [InViewDirective, MomCard, DadCard, BabyCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Family {}
