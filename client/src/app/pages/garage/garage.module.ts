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
import { FuelListComponent } from './fuel-list/fuel-list.component';
import { VehiclesListComponent } from './vehicle-list/vehicle-list.component';
import { VehiclesDetailsComponent } from './vehicle-details/vehicle-details.component';
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
    },
    {
        path: 'vehicle/:vehicle_id/fuel',
        component: FuelListComponent,
    }],
    canActivate: [AuthGuard]
}];

@NgModule({
    declarations: [
        GarageComponent,
        FuelListComponent,
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
