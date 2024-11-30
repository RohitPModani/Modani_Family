import { provideRouter } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { FamilyComponent } from './family/family.component';

export const routes = [
  { path: '', component: LandingComponent },
  { path: 'family', component: FamilyComponent },
];

export const appRouterProviders = [provideRouter(routes)];
