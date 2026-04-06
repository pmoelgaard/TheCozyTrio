import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  GameService,
  EASTER_EGGS,
} from '../../shared/services/game.service';

interface HeartSpot {
  readonly id: string;
  readonly top: string;
  readonly left: string;
  readonly rotate: string;
}

/**
 * Ten tiny hearts hidden at fixed page coordinates. Almost invisible
 * by default — they fade in on hover and award a point on click.
 * Badge bottom-right shows progress; finding all 10 fires an event.
 *
 * Rendered once at the App root; positions are relative to the
 * document so they anchor to sections throughout the page.
 */
@Component({
  selector: 'cozy-hidden-hearts',
  templateUrl: './hidden-hearts.html',
  styleUrl: './hidden-hearts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HiddenHearts {
  private readonly game = inject(GameService);

  protected readonly spots: readonly HeartSpot[] = [
    { id: 'h1',  top: '12vh',  left: '8%',  rotate: '-10deg' },
    { id: 'h2',  top: '28vh',  left: '92%', rotate: '15deg' },
    { id: 'h3',  top: '45vh',  left: '15%', rotate: '0deg' },
    { id: 'h4',  top: '70vh',  left: '85%', rotate: '-8deg' },
    { id: 'h5',  top: '110vh', left: '10%', rotate: '12deg' },
    { id: 'h6',  top: '145vh', left: '88%', rotate: '-5deg' },
    { id: 'h7',  top: '180vh', left: '25%', rotate: '20deg' },
    { id: 'h8',  top: '225vh', left: '78%', rotate: '-15deg' },
    { id: 'h9',  top: '275vh', left: '18%', rotate: '10deg' },
    { id: 'h10', top: '320vh', left: '82%', rotate: '-8deg' },
  ];

  protected readonly found = this.game.heartsFound;
  protected readonly count = this.game.heartsFoundCount;

  protected readonly allFound = computed(() => this.count() >= 10);

  protected find(id: string): void {
    if (this.found().has(id)) return;
    this.game.findHeart(id);
    if (this.game.heartsFoundCount() === 10) {
      // Reuse the central activeEgg for a brief celebration moment.
      this.game.open(EASTER_EGGS.konami);
    }
  }

  protected isFound(id: string): boolean {
    return this.found().has(id);
  }
}
