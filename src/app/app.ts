import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from './sections/hero/hero';
import { Family } from './sections/family/family';
import { CultureBlend } from './sections/culture-blend/culture-blend';
import { Milestones } from './sections/milestones/milestones';
import { GameHost } from './games/game-host';
import { HiddenHearts } from './games/hidden-hearts/hidden-hearts';

@Component({
  selector: 'app-root',
  imports: [Hero, Family, CultureBlend, Milestones, GameHost, HiddenHearts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
