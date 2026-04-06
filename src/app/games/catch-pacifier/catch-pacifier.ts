import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { GameService } from '../../shared/services/game.service';
import { PlatformService } from '@xsite/core';

interface FallingPacifier {
  readonly id: number;
  readonly left: number; // 0..100 %
  readonly duration: number; // seconds
  readonly delay: number;
  readonly caught: boolean;
}

/**
 * 30-second game. Pacifiers fall from the top of the play area.
 * Click each one before it hits the ground. Each catch = +1 point,
 * each miss = no penalty (this is a baby game, be gentle).
 */
@Component({
  selector: 'cozy-catch-pacifier',
  templateUrl: './catch-pacifier.html',
  styleUrl: './catch-pacifier.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatchPacifier implements OnInit {
  private readonly game = inject(GameService);
  private readonly platform = inject(PlatformService);
  private readonly destroyRef = inject(DestroyRef);

  readonly won = output<void>();

  protected readonly score = signal(0);
  protected readonly timeLeft = signal(30);
  protected readonly running = signal(false);
  protected readonly finished = signal(false);
  protected readonly pacifiers = signal<readonly FallingPacifier[]>([]);
  protected readonly highScore = this.game.pacifierHighScore;

  private nextId = 0;
  private spawnTimer: ReturnType<typeof setInterval> | null = null;
  private tickTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    if (this.platform.isBrowser) {
      this.start();
    }
    this.destroyRef.onDestroy(() => this.stop());
  }

  protected start(): void {
    this.score.set(0);
    this.timeLeft.set(30);
    this.pacifiers.set([]);
    this.finished.set(false);
    this.running.set(true);

    this.spawnTimer = setInterval(() => this.spawn(), 700);
    this.tickTimer = setInterval(() => {
      const t = this.timeLeft() - 1;
      this.timeLeft.set(t);
      if (t <= 0) this.finish();
    }, 1000);
  }

  private spawn(): void {
    const p: FallingPacifier = {
      id: this.nextId++,
      left: 5 + Math.random() * 90,
      duration: 2.5 + Math.random() * 1.5,
      delay: 0,
      caught: false,
    };
    this.pacifiers.set([...this.pacifiers(), p]);
    // Clean up after it's fallen off screen
    setTimeout(() => {
      this.pacifiers.set(this.pacifiers().filter((x) => x.id !== p.id));
    }, (p.duration + 0.5) * 1000);
  }

  protected catchOne(id: number): void {
    if (!this.running()) return;
    const list = this.pacifiers();
    const target = list.find((p) => p.id === id);
    if (!target || target.caught) return;
    this.score.set(this.score() + 1);
    this.pacifiers.set(
      list.map((p) => (p.id === id ? { ...p, caught: true } : p)),
    );
    // Remove quickly after "caught" visual
    setTimeout(() => {
      this.pacifiers.set(this.pacifiers().filter((p) => p.id !== id));
    }, 300);
  }

  private finish(): void {
    this.stop();
    this.finished.set(true);
    this.game.submitPacifierScore(this.score());
    if (this.score() >= 5) this.won.emit();
  }

  private stop(): void {
    this.running.set(false);
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.tickTimer) clearInterval(this.tickTimer);
    this.spawnTimer = null;
    this.tickTimer = null;
  }
}
