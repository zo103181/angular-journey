import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DashboardComponent } from "./dashboard.component";
import { SharedModule } from 'src/app/shared/shared.module';

const routes = [{
    path: '',
    component: DashboardComponent
}];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class DashboardModule { }
