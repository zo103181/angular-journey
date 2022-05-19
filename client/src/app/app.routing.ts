import { Route } from "@angular/router";
import { PageLayoutComponent } from "./layout/page-layout.component";

export const appRoutes: Route[] = [
    {
        path: 'auth',
        component: PageLayoutComponent,
        data: { layout: 'empty' },
        loadChildren: () => import('./pages/authentication/authentication.module').then(m => m.AuthenticationModule)
    },
    {
        path: 'settings',
        component: PageLayoutComponent,
        data: { layout: 'side-navigation' },
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule)
    },
    {
        path: 'garage',
        component: PageLayoutComponent,
        data: { layout: 'side-navigation' },
        loadChildren: () => import('./pages/garage/garage.module').then(m => m.GarageModule)
    },
    {
        path: 'dashboard',
        component: PageLayoutComponent,
        data: { layout: 'side-navigation' },
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: '',
        loadChildren: () => import('./pages/landing/home/home.module').then(m => m.LandingHomeModule)
    }
]