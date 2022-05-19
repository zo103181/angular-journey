import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable, Subject, takeUntil } from 'rxjs';

import { CustomBreakpointNames } from '../../../shared/services/breakpoints.service';
import { LayoutService } from '../../../shared/services/layout.service';
import { Vehicle } from '../../../core/models/vehicle.interface';
import { VehicleService } from '../../../core/vehicle/vehicle.service';

@Component({
    selector: 'vehicles-list',
    templateUrl: './vehicle-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesListComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    vehicles$: Observable<Vehicle[]>;

    vehiclesCount: number = 0;
    drawerMode: 'side' | 'over';
    selectedVehicle: Vehicle;
    private unsubscribeAll = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private activatedRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private vehicleService: VehicleService,
        private router: Router,
        private layoutService: LayoutService,
    ) {
    }

    ngOnInit(): void {
        this.vehicles$ = this.vehicleService.vehicles$;
        this.vehicleService.vehicles$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicles: Vehicle[]) => {
                // Update the counts
                this.vehiclesCount = vehicles.length;

                // Mark for check
                this.changeDetectorRef.markForCheck();
            });

        // Get the vehicle
        this.vehicleService.vehicle$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicle: Vehicle) => {
                // Update the selected vehicle
                this.selectedVehicle = vehicle;

                // Mark for check
                this.changeDetectorRef.markForCheck();
            });

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if (!opened) {
                // Remove the selected vehicle when drawer closed
                this.selectedVehicle = null;

                // Mark for check
                this.changeDetectorRef.markForCheck();
            }
        });
    }

    ngAfterViewInit(): void {
        this.layoutService.subscribeToLayoutChanges().subscribe(observerResponse => {
            // You will have all matched breakpoints in observerResponse
            switch (true) {
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['lg'])):
                    this.drawerMode = 'side';
                    break;
                default:
                    this.drawerMode = 'over';
                    break;

            }

            this.drawerMode = 'over';

            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    onBackdropClicked(): void {
        // Go back to the list
        this.router.navigate(['./'], { relativeTo: this.activatedRoute });

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    newVehicle() {
        this.router.navigate(['garage/vehicle/new']);
    }

}
