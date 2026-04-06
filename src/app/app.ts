import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '@xsite/theme';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly theme = inject(ThemeService);

  protected setTheme(name: 'boy' | 'girl'): void {
    this.theme.setTheme(name);
  }
}
