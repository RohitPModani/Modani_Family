import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

// Extend appConfig to include HttpClient
const extendedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideHttpClient() // Add HttpClient support
  ],
};

bootstrapApplication(AppComponent, extendedAppConfig)
  .catch((err) => console.error(err));
