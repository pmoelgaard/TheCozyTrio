import {
  Directive,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { PlatformService } from '@xsite/core';
import { GameService, EASTER_EGGS } from '../services/game.service';

const CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

/**
 * Listens on <body> for the Konami code. On full match, triggers the
 * "secret family dance" easter egg via GameService. Attach to the
 * app root — there only needs to be one instance.
 */
@Directive({
  selector: '[cozyKonami]',
  standalone: true,
})
export class KonamiDirective implements OnInit {
  private readonly game = inject(GameService);
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);

  private buffer: string[] = [];

  ngOnInit(): void {
    if (!this.platform.isBrowser) return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key;
      this.buffer.push(key);
      // Trim buffer to the most recent N keystrokes.
      if (this.buffer.length > CODE.length) {
        this.buffer = this.buffer.slice(-CODE.length);
      }
      if (this.buffer.length === CODE.length) {
        const match = this.buffer.every((k, i) => {
          const expected = CODE[i];
          return k.toLowerCase() === expected.toLowerCase();
        });
        if (match) {
          this.buffer = [];
          this.game.open(EASTER_EGGS.konami);
        }
      }
    };

    document.addEventListener('keydown', handler);
    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', handler);
    });
  }
}
