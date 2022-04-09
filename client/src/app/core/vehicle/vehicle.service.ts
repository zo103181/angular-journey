import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Vehicle } from '../models/vehicle.interface';

@Injectable({ providedIn: 'root' })
export class VehicleService {
    constructor(
        private httpClient: HttpClient
    ) { }

    loadGarage(user_uid: string): Observable<Vehicle[]> {
        return this.httpClient.get<Vehicle[]>(`/api/vehicles/${user_uid}`);
    }

    getVehicle(vehicle_id: string): Observable<Vehicle> {
        return this.httpClient.get<Vehicle>(`/api/vehicle/${vehicle_id}`);
    }

    createVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.httpClient.post<Vehicle>(`/api/vehicle`, vehicle);
    }

    updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
        return this.httpClient.put<Vehicle>(`/api/vehicle`, vehicle);
    }

    deleteVehicle(vehicle_id: string, user_uid: string) {
        return this.httpClient.delete<string>(`/api/vehicle`, { body: { vehicle_id, user_uid } });
    }
}