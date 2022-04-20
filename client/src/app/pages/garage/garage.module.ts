import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GarageComponent } from './garage.component';
import { VehiclesListComponent } from './list/list.component';
import { VehiclesDetailsComponent } from './details/details.component';
import { AuthGuard } from '../../core/auth/guards/auth.guard';
import { SharedModule } from '../../shared/shared.module';
import { CanDeactivateVehicleDetails } from './garage.guard';
import { VehicleResolver, VehiclesResolver } from './garage.resolvers';

const routes = [{
    path: '',
    component: GarageComponent,
    children: [{
        path: '',
        component: VehiclesListComponent,
        resolve: {
            vehicles: VehiclesResolver
        },
        children: [{
            path: 'vehicle/:id',
            component: VehiclesDetailsComponent,
            resolve: {
                vehicle: VehicleResolver
            },
            canDeactivate: [CanDeactivateVehicleDetails]
        }]
    }],
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        GarageComponent,
        VehiclesListComponent,
        VehiclesDetailsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatDatepickerModule,
        MatIconModule,
        MatMomentDateModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SharedModule,
    ]
})
export class GarageModule { }
