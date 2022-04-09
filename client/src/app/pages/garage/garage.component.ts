import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { User } from 'src/app/core/models/user.interface';
import { Vehicle } from 'src/app/core/models/vehicle.interface';
import { UserService } from '../../core/user/user.service';
import { VehicleService } from '../../core/vehicle/vehicle.service';

@Component({
    selector: 'app-garage',
    templateUrl: './garage.component.html'
})
export class GarageComponent implements OnInit, OnDestroy {
    user: User;
    vehicles: Vehicle[] = [];

    private unsubscribeAll = new Subject<any>();

    constructor(
        private vehicleService: VehicleService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
        this.vehicleService.loadGarage(this.user.uid)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicles: Vehicle[]) => {
                this.vehicles = [...vehicles];
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    createVehicle(vehicle: Vehicle) {
        vehicle = {
            "user_id": "3623d8a4-0168-4684-a4de-1987d89e5495",
            "year": 2013,
            "manufacturer": "Volkswagen",
            "model": "Jetta GLI (New)",
            "color": "Candy White",
            "bodystyle": "Sedan",
            "interior": "2.0L I4 TSI",
            "motor": "Gasoline",
            "motor_type": "6-Speed DSG",
            "transmission": "FWD",
            "drivetrain": "Titan Black Leather",
            "nickname": null,
            "purchase_date": new Date("2019-02-20T06:00:00.000Z"),
            "purchase_price": 24208.94,
            "purchase_mileage": 207,
            "sold_date": null,
            "sold_price": null,
            "sold_mileage": null,
            "vin": "3VW4A7AJ8DM407224"
        }

        this.vehicleService.createVehicle(vehicle)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicle: Vehicle) => {
                this.vehicles = [...this.vehicles, vehicle].sort((a, b) => (a.purchase_date < b.purchase_date) ? 1 : -1);
            });
    }

    editVehicle(vehicle: Vehicle) {
        console.log(vehicle);
    }

    updateVehicle(vehicle: Vehicle) {
        this.vehicleService.updateVehicle(vehicle)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicle: Vehicle) => {
                console.log(vehicle);
            });
    }

    deleteVehicle(vehicle: Vehicle) {
        this.vehicleService.deleteVehicle(vehicle.vehicle_id, this.user.uid)
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((vehicle_id: string) => {
                const filteredVehicles = this.vehicles.filter(itm => itm.vehicle_id !== vehicle_id);
                this.vehicles = filteredVehicles;
            })
    }

}
