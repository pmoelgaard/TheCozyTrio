import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ThemeService } from '@xtnd-dynamics/xsite-theme';
import { PlatformService } from '@xtnd-dynamics/xsite-core';

/**
 * The signature move: a toggle switch that, on flip, paints the
 * entire viewport with a circular wipe radiating from the click
 * coordinates, then reveals the newly-themed page underneath.
 *
 * How the wipe works without DOM cloning or html2canvas:
 *   1. Click handler captures pointer coords relative to the viewport.
 *   2. Before calling ThemeService.setTheme(), we read the current
 *      surface/action colors from the live CSS custom properties.
 *      These are the OLD theme colors.
 *   3. We append a fixed full-viewport <div> (the "wipe plate")
 *      painted in the OLD surface color with a radial-gradient
 *      accent so the circle isn't flat. We then call setTheme()
 *      — the rest of the page instantly flips to the NEW palette.
 *   4. The wipe plate animates its clip-path from a full-viewport
 *      circle centered at the click point down to radius 0 over
 *      ~800ms. The new-themed page reveals through the shrinking
 *      hole. When the animation ends we remove the plate.
 *
 * The plate is position:fixed at z-index 9999 and pointer-events:none
 * so it never blocks interaction.
 */
@Component({
  selector: 'cozy-theme-toggle',
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  private readonly themeService = inject(ThemeService);
  private readonly platform = inject(PlatformService);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Is a wipe animation currently in flight? Debounces rapid clicks. */
  protected readonly animating = signal(false);

  protected readonly track = viewChild<ElementRef<HTMLButtonElement>>('track');

  /** Current theme, as a signal, for the template. */
  protected readonly theme = this.themeService.theme;

  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  protected onKey(e: Event): void {
    e.preventDefault();
    // Use the toggle's own center as the wipe origin when activated by keyboard.
    const rect = this.track()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    this.flip(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  protected onClick(event: MouseEvent): void {
    this.flip(event.clientX, event.clientY);
  }

  private flip(originX: number, originY: number): void {
    if (this.animating()) return;
    if (!this.platform.isBrowser) {
      // SSR / server — just switch, no animation.
      this.swap();
      return;
    }

    // Capture the *current* (about-to-be-old) surface and action colors
    // from the live DOM. Reading computed styles means we always use
    // whatever the XSite semantic layer has resolved for this theme.
    const computed = getComputedStyle(document.documentElement);
    const oldSurface =
      computed.getPropertyValue('--color-surface-base').trim() || '#ffffff';
    const oldAction =
      computed.getPropertyValue('--color-action-default').trim() || '#4A90D9';

    // Compute the max radius needed — farthest viewport corner from the click.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(originX, vw - originX),
      Math.max(originY, vh - originY),
    );

    // Build the wipe plate.
    const plate = document.createElement('div');
    plate.setAttribute('aria-hidden', 'true');
    Object.assign(plate.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '9999',
      pointerEvents: 'none',
      background: `radial-gradient(circle at ${originX}px ${originY}px, ${oldAction}, ${oldSurface} 60%)`,
      clipPath: `circle(${maxRadius}px at ${originX}px ${originY}px)`,
      transition: 'clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1)',
      willChange: 'clip-path',
    } as CSSStyleDeclaration);
    document.body.appendChild(plate);

    // Flip the theme. The page is now re-rendered in the NEW theme,
    // but the user can't see it yet — the plate covers everything.
    this.animating.set(true);
    this.swap();

    // Next frame, kick off the shrinking clip-path.
    requestAnimationFrame(() => {
      // Double rAF ensures the starting clip-path is committed first.
      requestAnimationFrame(() => {
        plate.style.clipPath = `circle(0px at ${originX}px ${originY}px)`;
      });
    });

    // Cleanup after the transition ends.
    const done = () => {
      plate.removeEventListener('transitionend', done);
      plate.remove();
      this.animating.set(false);
    };
    plate.addEventListener('transitionend', done, { once: true });

    // Safety net if transitionend doesn't fire (tab backgrounded etc.)
    setTimeout(done, 1200);
  }

  private swap(): void {
    this.themeService.setTheme(this.theme() === 'boy' ? 'girl' : 'boy');
  }
}
