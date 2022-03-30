import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GarageComponent } from './garage.component';
import { AuthGuard } from '../../core/auth/guards/auth.guard';
import { SharedModule } from '../../shared/shared.module';

const routes = [{
    path: '',
    component: GarageComponent,
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [GarageComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GarageModule { }
