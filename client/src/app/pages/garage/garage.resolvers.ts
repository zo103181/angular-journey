import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { catchError, Observable, Subject, takeUntil, throwError } from 'rxjs';

import { UserService } from '../../core/user/user.service';
import { User } from '../../core/models/user.interface';
import { Vehicle } from '../../core/models/vehicle.interface';
import { VehicleService } from '../../core/vehicle/vehicle.service';

@Injectable({
    providedIn: 'root'
})
export class VehiclesResolver implements Resolve<any>
{
    user: User;
    private unsubscribeAll = new Subject<any>();

    constructor(
        private vehicleService: VehicleService,
        private userService: UserService
    ) {
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vehicle[]> {
        return this.vehicleService.loadVehicles(this.user.uid);
    }
}

@Injectable({
    providedIn: 'root'
})
export class VehicleResolver implements Resolve<any>
{
    user: User;
    private unsubscribeAll = new Subject<any>();

    constructor(
        private router: Router,
        private vehicleService: VehicleService,
        private userService: UserService
    ) {
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Vehicle> {
        return this.vehicleService.getVehicleById(route.paramMap.get('id'))
            .pipe(
                // Error here means the requested vehicle is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this.router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}