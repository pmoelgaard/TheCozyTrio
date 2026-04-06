import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { InViewDirective, PlatformService } from '@xtnd-dynamics/xsite-core';
import { GameService, EASTER_EGGS } from '../../shared/services/game.service';

export interface Milestone {
  readonly id: string;
  readonly month: string;
  readonly title: string;
  readonly body: string;
  readonly emoji: string;
}

/**
 * Vertical timeline of baby's first 8 months. The SVG line draws itself
 * in as the user scrolls (stroke-dashoffset animates from
 * max-length to 0, proportional to how far the section is through
 * the viewport).
 *
 * Month 6 → hover for 3s triggers Catch-the-Pacifier.
 * Month 8 → click triggers Memory Match.
 */
@Component({
  selector: 'cozy-milestones',
  templateUrl: './milestones.html',
  styleUrl: './milestones.scss',
  imports: [InViewDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Milestones {
  private readonly platform = inject(PlatformService);
  private readonly game = inject(GameService);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly milestones: readonly Milestone[] = [
    { id: 'm0', month: 'Month 0', title: 'Hello, world',  body: 'First cry, first photo, first milky smile.', emoji: '👶' },
    { id: 'm1', month: 'Month 1', title: 'Tiny yawner',   body: 'Sleep, eat, repeat. A very serious schedule.', emoji: '😴' },
    { id: 'm2', month: 'Month 2', title: 'The first real smile', body: 'Eye contact. Dimples. Hearts, melted.', emoji: '😊' },
    { id: 'm3', month: 'Month 3', title: 'Coo conversationalist', body: 'Long philosophical gurgles with the ceiling.', emoji: '💬' },
    { id: 'm4', month: 'Month 4', title: 'Belly flop', body: 'Rolls over once. Looks extremely surprised.', emoji: '🔄' },
    { id: 'm5', month: 'Month 5', title: 'The grabber', body: 'Everything goes in the mouth. Absolutely everything.', emoji: '✋' },
    { id: 'm6', month: 'Month 6', title: 'First taste', body: 'Introducing adobo broth and Danish rye crumbs.', emoji: '🥄' },
    { id: 'm7', month: 'Month 7', title: 'Sitting pretty', body: 'Unassisted sitting! A whole new point of view.', emoji: '🪑' },
    { id: 'm8', month: 'Month 8', title: 'Today', body: 'Babbles in two languages. Hugs with both arms.', emoji: '💙' },
  ];

  /** 0..1 scroll progress through the section, bound to the SVG line. */
  protected readonly progress = signal(0);

  private pacifierHoverTimer: ReturnType<typeof setTimeout> | null = null;

  protected readonly root = viewChild<ElementRef<HTMLElement>>('root');

  @HostListener('window:scroll')
  protected onScroll(): void {
    if (!this.platform.isBrowser) return;
    const el = this.root()?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // Start drawing when top crosses 80% of viewport, finish when
    // bottom crosses 20% of viewport.
    const start = vh * 0.8;
    const end = -rect.height + vh * 0.2;
    const p = 1 - (rect.top - end) / (start - end);
    this.progress.set(Math.max(0, Math.min(1, p)));
  }

  /** Month 6 hover — starts a 3s timer; if still hovered, fire easter egg. */
  protected onMonth6Enter(): void {
    this.pacifierHoverTimer = setTimeout(() => {
      this.game.open(EASTER_EGGS.catchPacifier);
      this.pacifierHoverTimer = null;
    }, 3000);
  }

  protected onMonth6Leave(): void {
    if (this.pacifierHoverTimer) {
      clearTimeout(this.pacifierHoverTimer);
      this.pacifierHoverTimer = null;
    }
  }

  /** Month 8 click — memory match. */
  protected onMonth8Click(): void {
    this.game.open(EASTER_EGGS.memoryMatch);
  }
}
