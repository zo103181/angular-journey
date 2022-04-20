import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import * as moment from 'moment';

import { VehiclesListComponent } from '../list/list.component';
import { VehicleService } from '../../../core/vehicle/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.interface';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { User } from 'src/app/core/models/user.interface';
import { UserService } from 'src/app/core/user/user.service';

@Component({
    selector: 'vehicle-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehiclesDetailsComponent implements OnInit, OnDestroy {
    editMode: boolean = false;
    user: User;
    vehicleForm: FormGroup;
    vehicle: Vehicle;

    private unsubscribeAll = new Subject<any>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private vehicleListComponent: VehiclesListComponent,
        private vehicleService: VehicleService
    ) { }

    ngOnInit(): void {
        // Open the drawer
        this.vehicleListComponent.matDrawer.open();

        this.vehicleForm = this.formBuilder.group({
            vehicle_id: [''],
            user_id: [''],
            year: ['', [Validators.required, Validators.minLength(4)]],
            manufacturer: ['', [Validators.required]],
            model: ['', [Validators.required]],
            color: [''],
            bodystyle: [''],
            motor: [''],
            motor_type: [''],
            transmission: [''],
            drivetrain: [''],
            interior: [''],
            nickname: [null],
            purchase_date: [null],
            purchase_price: [null],
            purchase_mileage: [null],
            sold_date: [null],
            sold_price: [null],
            sold_mileage: [null],
            vin: ['']
        });

        this.vehicleService.vehicle$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicle: Vehicle) => {
                if (vehicle) {
                    if (!vehicle.vehicle_id) { this.toggleEditMode(true); }
                    this.vehicle = vehicle;

                    // Patch values to the form
                    this.vehicleForm.patchValue(vehicle);

                    // Mark for check
                    this.changeDetectorRef.markForCheck();
                }
            });

        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            })
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this.vehicleListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        if (this.vehicle) { this.vehicleForm.patchValue(this.vehicle); }

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private formatDate(item: any, format: string = "YYYY-MM-DD") {
        return (item) ? ((item.toString().trim() === '') ? null : moment(item).format(format)) : null;
    }

    private formatPrice(item: any, fractionDigits: number = 0) {
        return (item) ? ((item.toString().trim() === '') ? null : parseFloat(item).toFixed(fractionDigits)) : null;
    }

    private formatMileage(item: any) {
        return (item) ? (item.toString().trim() === '') ? null : parseInt(item).toString() : null;
    }

    onCancel(vehicle: Vehicle): void {
        if (vehicle.vehicle_id) {
            this.toggleEditMode(false);
        } else {
            this.closeDrawer().then(() => true);
            this.router.navigate(['garage']);
        }
    }

    onSave(vehicle: Vehicle): void {
        vehicle.user_id = this.user.id;
        vehicle.purchase_date = this.formatDate(vehicle.purchase_date, 'YYYY-MM-DD');
        vehicle.purchase_price = this.formatPrice(vehicle.purchase_price, 2);
        vehicle.purchase_mileage = this.formatMileage(vehicle.purchase_mileage);

        vehicle.sold_date = this.formatDate(vehicle.sold_date, 'YYYY-MM-DD');
        vehicle.sold_price = this.formatPrice(vehicle.sold_price, 2);
        vehicle.sold_mileage = this.formatMileage(vehicle.sold_mileage);

        if (vehicle.nickname) {
            if (vehicle.nickname.trim() === '') { vehicle.nickname = null; }
        }

        if (vehicle.vehicle_id === '') {
            vehicle.user_id = this.user.id;
            this.vehicleService.createVehicle(vehicle).pipe(takeUntil(this.unsubscribeAll)).subscribe({
                next: (vehicle) => {
                    if (vehicle?.vehicle_id) {
                        this.toggleEditMode(false);
                        this.router.navigate([`garage`]);
                    }
                },
                error: (error) => {
                    console.error(error);
                }
            });
        } else {
            this.vehicleService.updateVehicle(vehicle).pipe(takeUntil(this.unsubscribeAll)).subscribe({
                next: (vehicle) => {
                    console.log(vehicle)
                    this.toggleEditMode(false);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        }
    }

    onDelete(vehicle: Vehicle): void {
        this.vehicleService.deleteVehicle(vehicle.vehicle_id, this.user.uid)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe({
                next: (vehicle_id: string) => {
                    this.toggleEditMode(false);
                    this.router.navigate(['garage']);
                },
                error: (error: Error) => {
                    console.error(error);
                }
            })
    }
}