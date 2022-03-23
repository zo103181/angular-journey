import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes = [{
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class DashboardModule { }
