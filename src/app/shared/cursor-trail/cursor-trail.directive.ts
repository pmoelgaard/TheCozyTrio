import {
  Directive,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { PlatformService, prefersReducedMotion } from '@xsite/core';

const GLYPHS = ['💙', '💖', '⭐', '✨', '🫧'];
const SPAWN_EVERY = 70; // ms throttle — don't spam DOM nodes on fast moves
const LIFETIME = 900;   // ms — matches the CSS animation duration

/**
 * Cursor trail: spawns tiny glyph particles at the pointer on mousemove,
 * each one fades + floats + rotates away over ~900ms, then self-removes.
 *
 * Uses direct document body appending (not Angular view refs) — this
 * is fine for pure-visual ephemera and keeps the directive free from
 * change detection overhead on every mousemove.
 *
 * Skipped entirely on touch devices (no meaningful cursor), on SSR,
 * and when the OS says "prefers-reduced-motion".
 */
@Directive({
  selector: '[cozyCursorTrail]',
  standalone: true,
})
export class CursorTrailDirective implements OnInit {
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);

  private lastSpawn = 0;

  ngOnInit(): void {
    if (!this.platform.isBrowser) return;
    if (prefersReducedMotion()) return;

    // No hover cursor on touch-only devices — skip.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return;
    }

    const layer = document.createElement('div');
    layer.className = 'cozy-cursor-trail-layer';
    layer.style.position = 'fixed';
    layer.style.inset = '0';
    layer.style.pointerEvents = 'none';
    layer.style.zIndex = '9000';
    layer.style.overflow = 'hidden';
    document.body.appendChild(layer);

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - this.lastSpawn < SPAWN_EVERY) return;
      this.lastSpawn = now;

      const particle = document.createElement('span');
      particle.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      particle.className = 'cozy-cursor-trail-particle';
      const drift = (Math.random() * 40 - 20).toFixed(0);
      const rot = (Math.random() * 60 - 30).toFixed(0);
      particle.style.position = 'absolute';
      particle.style.left = `${e.clientX - 10}px`;
      particle.style.top = `${e.clientY - 10}px`;
      particle.style.fontSize = `${12 + Math.random() * 8}px`;
      particle.style.pointerEvents = 'none';
      particle.style.userSelect = 'none';
      particle.style.willChange = 'transform, opacity';
      particle.style.animation = `cozy-cursor-float ${LIFETIME}ms ease-out forwards`;
      // CSS custom properties aren't typed on CSSStyleDeclaration — use setProperty.
      particle.style.setProperty('--drift-x', `${drift}px`);
      particle.style.setProperty('--rot', `${rot}deg`);
      layer.appendChild(particle);
      setTimeout(() => particle.remove(), LIFETIME);
    };

    document.addEventListener('mousemove', onMove, { passive: true });

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('mousemove', onMove);
      layer.remove();
    });
  }
}
