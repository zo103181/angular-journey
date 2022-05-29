import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { FuelLogService } from '../../../core/fuel-log/fuel-log.service';
import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/models/user.interface';
import { FuelLog, FuelLogResponseWrapper } from 'src/app/core/models/fuel-log.interface';
import { Vehicle } from '../../../core/models/vehicle.interface';
import { VehicleService } from '../../../core/vehicle/vehicle.service';

@Component({
    selector: 'fuel-log-list',
    templateUrl: './fuel-list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuelListComponent implements OnInit, OnDestroy {

    fuelLog$: BehaviorSubject<FuelLog> | null = new BehaviorSubject(null);
    fuelLogs$: Observable<FuelLogResponseWrapper>;
    showFuelLogForm: BehaviorSubject<boolean> = new BehaviorSubject(false);
    vehicle$: Observable<Vehicle>;
    private route: ActivatedRouteSnapshot;
    private user: User;
    private unsubscribeAll = new Subject<any>();
    private page: number = 1;
    private rows_per_page: number = 20;
    private vehicle_id: string;

    constructor(
        private currentRoute: ActivatedRoute,
        private fuelLogService: FuelLogService,
        private userService: UserService,
        private vehicleService: VehicleService
    ) {
        this.route = this.currentRoute.snapshot;
        this.vehicle_id = this.route.paramMap.get(`vehicle_id`);
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
            });
    }

    ngOnInit(): void {
        this.fuelLogs$ = this.fuelLogService.loadFuelLogs(this.user.id, this.vehicle_id);
        this.vehicle$ = this.vehicleService.getVehicleFromHttpById(this.vehicle_id);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    loadLogs(page: number, rows_per_page: number) {
        if (page < 1) return;
        this.page = page;
        this.rows_per_page = rows_per_page;
        this.fuelLogs$ = this.fuelLogService.loadFuelLogs(this.user.id, this.vehicle_id, page, rows_per_page);
    }

    getLogById(log_id: string) {
        this.fuelLogService.getFuelLogById(log_id, this.user.id, this.vehicle_id).pipe(catchError((error) => {
            if (error.status = 404) {
                console.error('We could not find this fuel log at this time');
            }
            return of(null);
        })).subscribe((response) => {
            this.showFuelLogForm.next(true);
            this.fuelLog$.next(response);
        });
    }

    createLog(log: FuelLog) {
        this.fuelLogService.createFuelLog(log, this.user.id, this.vehicle_id, this.page, this.rows_per_page).pipe(catchError((error) => {
            console.log(error);
            return of(null);
        })).subscribe(response => {
            this.showFuelLogForm.next(false);
            this.fuelLogs$ = of(response);
        })
    }

    updateLog(log: FuelLog) {
        this.fuelLogService.updateFuelLog(log, this.user.id, this.vehicle_id, this.page, this.rows_per_page).pipe(catchError((error) => {
            console.log(error);
            return of(null);
        })).subscribe(response => {
            this.showFuelLogForm.next(false);
            this.fuelLogs$ = of(response);
        });
    }

    deleteLogById(log_id: string) {
        this.fuelLogService.deleteFuelLog(log_id, this.user.id, this.page, this.rows_per_page).pipe(catchError((error) => {
            if (error.status = 404) {
                console.error('We could not find this fuel log at this time');
            }
            return of(null);
        })).subscribe(response => {
            this.showFuelLogForm.next(false);
            this.fuelLogs$ = of(response);
        });
    }
}