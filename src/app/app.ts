import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@xsite/theme';
import { ThemeToggle } from './shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = inject(ThemeService);
}
