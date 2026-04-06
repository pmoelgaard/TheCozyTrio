import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideXsiteCore,
  PlatformService,
  StorageService,
} from '@xtnd-dynamics/xsite-core';
import { provideXsiteTheme } from '@xtnd-dynamics/xsite-theme';
import { provideXsiteUi } from '@xtnd-dynamics/xsite-ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // xsite-core's MetaService auto-instantiates at boot via APP_INITIALIZER
    // and hard-injects Router + ActivatedRoute, so even a router-less SPA
    // needs provideRouter() with an empty table to satisfy the DI graph.
    provideRouter([]),

    provideXsiteCore({
      siteName: 'The Cozy Trio',
      siteUrl: 'https://thecozytrio.pages.dev',
      locale: 'en',
      defaultMeta: {
        title: 'The Cozy Trio',
        description:
          'A Danish-Filipino love story, one tiny chapter at a time.',
      },
      nav: [],
      footer: {
        columns: [],
        legal: '© 2026 The Cozy Trio · made with love',
      },
    }),

    provideXsiteTheme({
      config: {
        defaultTheme: 'boy',
        defaultColorScheme: 'light',
        availableThemes: ['boy', 'girl'],
      },
      storageService: StorageService,
      platformService: PlatformService,
    }),

    provideXsiteUi({
      icons: {
        // Icons will be registered in Phase 5+ as sections need them.
      },
    }),
  ],
};
