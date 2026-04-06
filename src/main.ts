import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Phase 2 smoke import — confirms @xsite/{core,theme,ui} resolve via pnpm link.
// Providers are wired in src/app/app.config.ts in Phase 3.
import { provideXsiteCore } from '@xsite/core';
import { provideXsiteTheme } from '@xsite/theme';
import { provideXsiteUi } from '@xsite/ui';
void provideXsiteCore;
void provideXsiteTheme;
void provideXsiteUi;

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
