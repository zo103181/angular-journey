import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';

import { Vehicle } from '../models/vehicle.interface';

@Injectable({ providedIn: 'root' })
export class VehicleService {
    vehicle$: BehaviorSubject<Vehicle | null> = new BehaviorSubject(null);
    vehicles$: BehaviorSubject<Vehicle[] | null> = new BehaviorSubject(null);

    cmp = (a, b) => {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
    }

    sortVehicles(vehicles: Vehicle[]) {
        return vehicles.sort((a, b) => {
            return this.cmp(a.manufacturer, b.manufacturer) || this.cmp(b.year, a.year);
        });
    }

    constructor(
        private httpClient: HttpClient
    ) { }

    loadVehicles(user_uid: string): Observable<Vehicle[]> {
        return this.httpClient.get<Vehicle[]>(`/api/vehicles/${user_uid}`).pipe(
            tap((vehicles) => {
                this.vehicles$.next(this.sortVehicles(vehicles));
            })
        );
    }

    // getVehicleById(vehicle_id: string): Observable<Vehicle> {
    //     return this.httpClient.get<Vehicle>(`/api/vehicle/${vehicle_id}`);
    // }

    newVehicle(): Observable<Vehicle> {
        let vehicle: Vehicle = {
            year: null,
            manufacturer: '',
            model: '',
            color: '',
            bodystyle: '',
            motor: '',
            motor_type: '',
            transmission: '',
            drivetrain: '',
            interior: '',
            nickname: null,
            purchase_date: null,
            purchase_price: null,
            purchase_mileage: null,
            sold_date: null,
            sold_price: null,
            sold_mileage: null,
            vin: ''
        };
        this.vehicle$.next(vehicle);
        return of(vehicle);
    }

    getVehicleById(id: string): Observable<Vehicle> {
        return this.vehicles$.pipe(
            take(1),
            map((vehicles) => {
                const vehicle = vehicles.find(item => item.vehicle_id === id) || null;
                this.vehicle$.next(vehicle);
                return vehicle;
            }),
            switchMap((vehicle) => {
                if (!vehicle) {
                    if (id === 'new') { return this.newVehicle() }
                    return throwError(() => new Error(`Could not find vehicle with id of ${id}!`));
                }
                return of(vehicle);
            })
        );
    }

    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
        this.vehicles$.pipe(
            take(1),
            switchMap(vehicles => this.httpClient.post<Vehicle>(`/api/vehicle`, vehicle).pipe(
                catchError(response => { throw new Error(`Error: ${response.error}`) }),
                map((newVehicle) => {
                    this.vehicles$.next(this.sortVehicles([...vehicles, newVehicle]));
                    return newVehicle;
                })
            ))
        ).subscribe((vehicle) => {
            this.vehicle$.next(vehicle);
        });
        return this.vehicle$;
    }

    updateVehicle(vehicle: Vehicle): Observable<any> {
        this.vehicles$.pipe(
            take(1),
            switchMap(vehicles => this.httpClient.put<Vehicle>(`/api/vehicle`, vehicle).pipe(
                catchError(response => { throw new Error(`Error: ${response.error}`) }),
                map(() => this.sortVehicles([...vehicles.filter((row: Vehicle) => row.vehicle_id !== vehicle.vehicle_id), vehicle]))
            ))
        ).subscribe((vehicles) => {
            this.vehicle$.next(vehicle);
            this.vehicles$.next(vehicles);
        });
        return of(vehicle);
    }

    deleteVehicle(vehicle_id: string, user_uid: string): Observable<string> {
        this.vehicles$.pipe(
            take(1),
            switchMap(vehicles => this.httpClient.delete<string>(`/api/vehicle`, { body: { vehicle_id, user_uid } }).pipe(
                catchError(response => { throw new Error(`Error: ${response.error}`) }),
                map(() => this.sortVehicles([...vehicles.filter((row: Vehicle) => row.vehicle_id !== vehicle_id)]))
            ))
        ).subscribe((vehicles) => {
            this.vehicle$.next(null);
            this.vehicles$.next(vehicles);
        });
        return of(vehicle_id);
    }
}