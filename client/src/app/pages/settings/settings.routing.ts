import { Route } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AuthGuard } from '../../core/auth/guards/auth.guard';

export const settingsRoutes: Route[] = [
    {
        path: '',
        component: SettingsComponent,
        canActivate: [AuthGuard]
    }
];
