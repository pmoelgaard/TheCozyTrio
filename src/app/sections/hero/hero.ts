import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';
import { FloatingElements } from '../../shared/floating-elements/floating-elements';

/**
 * The landing hero. Structure:
 *   - Theme toggle pinned top-right.
 *   - Parallax cloud layers (three depths).
 *   - Per-letter bounce-in title "The Cozy Trio" (staggered delays via the
 *     :nth-child selector in SCSS, no JS).
 *   - Subtitle fade-in.
 *   - Inline animated SVG family scene (Mom, Dad, Baby) — all movement is
 *     pure CSS @keyframes so the browser can composite it.
 *   - Floating hearts/stars via cozy-floating-elements.
 *
 * Parallax is mouse-follow only (cheap) — scroll-linked parallax would
 * require ScrollService.scrollY which we can wire in later during Phase 8.
 */
@Component({
  selector: 'cozy-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  imports: [ThemeToggle, FloatingElements],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  /** "The Cozy Trio" split into letters — template iterates this for stagger. */
  protected readonly titleLetters = [
    'T',
    'h',
    'e',
    ' ',
    'C',
    'o',
    'z',
    'y',
    ' ',
    'T',
    'r',
    'i',
    'o',
  ];

  /** Mouse-parallax offsets in px, bound as CSS custom properties. */
  protected readonly parallaxX = signal(0);
  protected readonly parallaxY = signal(0);

  @HostListener('mousemove', ['$event'])
  protected onMouseMove(event: MouseEvent): void {
    // Normalize to -1..1 based on viewport, then scale.
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    this.parallaxX.set(nx * 20);
    this.parallaxY.set(ny * 20);
  }
}
