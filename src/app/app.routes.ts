import { Routes } from '@angular/router';
import { Home } from './features/home/home';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },

  {
    path: 'home',
    component: Home,
  },

  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.AboutPage),
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects').then((m) => m.ProjectsPage),
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/project-detail/project-detail').then((m) => m.ProjectDetailsPage),
  },

  {
    path: 'prayer-times',
    loadComponent: () =>
      import('./features/prayer-times.component/prayer-times.component').then(
        (m) => m.PrayerTimesComponent,
      ),
  },

  {
    path: 'islamic-resources',
    loadComponent: () =>
      import('./features/islamic-resources.component/islamic-resources.component').then(
        (m) => m.IslamicResourcesComponent,
      ),
  },

  {
    path: 'gallery',
    loadComponent: () =>
      import('./features/gallery.component/gallery.component').then((m) => m.GalleryComponent),
  },

  {
    path: 'contact-us',
    loadComponent: () =>
      import('./features/contact-us.component/contact-us.component').then(
        (m) => m.ContactUsComponent,
      ),
  },
  {
    path: 'announcements',
    loadComponent: () =>
      import('./features/announcements.component/announcements.component').then(
        (m) => m.AnnouncementsComponent,
      ),
  },
  {
    path: 'support-us',
    loadComponent: () =>
      import('./features/support-us.component/support-us.component').then(
        (m) => m.SupportUsComponent,
      ),
  },
  {
    path: 'our-impact',
    loadComponent: () =>
      import('./features/our-impact.component/our-impact.component').then(
        (m) => m.OurImpactComponent,
      ),
  },
  {
    path: 'madarasa',
    loadComponent: () => import('./features/madarasa/madarasa').then((m) => m.MadarasaPage),
  },
  {
    path: 'debug',
    loadComponent: () => import('./features/debug/debug').then((m) => m.Debug),
  },
  {
    path: 'islamic-calendar',
    loadComponent: () =>
      import('./features/islamic-calendar.component/islamic-calendar.component').then(
        (m) => m.IslamicCalendarComponent,
      ),
  },
  {
    path: 'donate/callback',
    loadComponent: () =>
      import('./features/donate-modal.component/donation-callback.component').then((m) => m.DonationCallbackComponent),
  },
];
