import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Hero } from './sections/hero/hero';
import { Family } from './sections/family/family';
import { CultureBlend } from './sections/culture-blend/culture-blend';
import { Milestones } from './sections/milestones/milestones';
import { GameHost } from './games/game-host';
import { HiddenHearts } from './games/hidden-hearts/hidden-hearts';
import { KonamiDirective } from './shared/konami/konami.directive';
import { GameService, EASTER_EGGS } from './shared/services/game.service';

const BASE_TITLE = 'The Cozy Trio';

const GAME_TITLES: Readonly<Record<string, string>> = {
  [EASTER_EGGS.peekABoo]:      'Peek-a-boo! · The Cozy Trio',
  [EASTER_EGGS.catchPacifier]: 'Catch the pacifier! · The Cozy Trio',
  [EASTER_EGGS.memoryMatch]:   'Memory match · The Cozy Trio',
  [EASTER_EGGS.wordMatcher]:   'Word matcher · The Cozy Trio',
  [EASTER_EGGS.momKaraoke]:    '🎤 Mom karaoke · The Cozy Trio',
  [EASTER_EGGS.dadHygge]:      '🕯️ Dad hygge · The Cozy Trio',
  [EASTER_EGGS.konami]:        '💃 Secret dance! · The Cozy Trio',
};

@Component({
  selector: 'app-root',
  imports: [
    Hero, Family, CultureBlend, Milestones,
    GameHost, HiddenHearts,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [KonamiDirective],
})
export class App {
  private readonly game = inject(GameService);
  private readonly title = inject(Title);

  constructor() {
    // Swap the page title when an easter egg opens; restore on close.
    effect(() => {
      const active = this.game.activeEgg();
      this.title.setTitle(active ? GAME_TITLES[active] ?? BASE_TITLE : BASE_TITLE);
    });
  }
}
