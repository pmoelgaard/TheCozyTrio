import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { XsDialogComponent } from '@xsite/ui';
import {
  GameService,
  EASTER_EGGS,
  EasterEggName,
} from '../shared/services/game.service';
import { PeekABoo } from './peek-a-boo/peek-a-boo';
import { CatchPacifier } from './catch-pacifier/catch-pacifier';
import { MemoryMatch } from './memory-match/memory-match';
import { WordMatcher } from './word-matcher/word-matcher';
import { MomKaraoke } from './mom-karaoke/mom-karaoke';
import { DadHygge } from './dad-hygge/dad-hygge';

/**
 * Single dialog shell that reads GameService.activeEgg and renders the
 * matching game component. Keeping this routing in one place means
 * every trigger — card clicks, milestone hover, konami code, heart
 * collection — goes through `game.open(name)` and the dialog handles
 * the rest.
 */
@Component({
  selector: 'cozy-game-host',
  templateUrl: './game-host.html',
  styleUrl: './game-host.scss',
  imports: [
    XsDialogComponent,
    PeekABoo,
    CatchPacifier,
    MemoryMatch,
    WordMatcher,
    MomKaraoke,
    DadHygge,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHost {
  private readonly game = inject(GameService);

  protected readonly active = this.game.activeEgg;
  protected readonly eggs = EASTER_EGGS;

  protected readonly title = computed(() => {
    switch (this.active()) {
      case EASTER_EGGS.peekABoo:      return 'Peek-a-boo!';
      case EASTER_EGGS.catchPacifier: return 'Catch the pacifier!';
      case EASTER_EGGS.memoryMatch:   return 'Memory match';
      case EASTER_EGGS.wordMatcher:   return 'Word matcher';
      case EASTER_EGGS.momKaraoke:    return 'Mom karaoke night 🎤';
      case EASTER_EGGS.dadHygge:      return 'Dad hygge hour 🕯️';
      case EASTER_EGGS.konami:        return 'Secret family dance! 💃';
      default:                        return 'Surprise!';
    }
  });

  /** Bound via [(open)] — when the dialog closes, reset activeEgg. */
  protected readonly isOpen = computed(() => this.active() !== null);

  protected onOpenChange(next: boolean): void {
    if (!next) this.game.close();
  }

  protected is(name: EasterEggName): boolean {
    return this.active() === name;
  }

  /** Games emit `won` — we don't need to do anything special, but we
   * could show confetti here later. */
  protected onWon(): void {
    // Intentionally empty; discovery is already tracked by game.open().
  }
}
