import { ChangeDetectionStrategy, Component, output } from '@angular/core';

/**
 * Not really a game — a short celebratory overlay triggered by 5
 * clicks on the Mom card. A cartoon mom holds a mic and music notes
 * fly everywhere.
 */
@Component({
  selector: 'cozy-mom-karaoke',
  templateUrl: './mom-karaoke.html',
  styleUrl: './mom-karaoke.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MomKaraoke {
  readonly won = output<void>();

  protected readonly lyrics = [
    '🎤 Mahal ko ang aking pamilya!',
    '🎶 La la la la… hygge & love!',
    '🎵 Mabuhay + Skål!',
  ];
}
