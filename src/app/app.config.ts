import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import {
  provideXsiteCore,
  PlatformService,
  StorageService,
} from '@xsite/core';
import { provideXsiteTheme } from '@xsite/theme';
import { provideXsiteUi } from '@xsite/ui';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

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
