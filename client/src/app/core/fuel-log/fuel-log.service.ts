import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, take, tap } from "rxjs";
import { FuelLog, FuelLogResponseWrapper } from "../models/fuel-log.interface";

@Injectable({ providedIn: 'root' })
export class FuelLogService {
    cmp = (a, b) => {
        if (a > b) return +1;
        if (a < b) return -1;
        return 0;
    }

    sortFuelLogs(logs: FuelLog[]) {
        return logs.sort((a, b) => {
            return this.cmp(a.purchase_date, b.purchase_date);
        });
    }

    constructor(private httpClient: HttpClient) { }

    loadFuelLogs(
        user_id: string,
        vehicle_id: string,
        page: number = 1,
        rows_per_page: number = 20
    ): Observable<FuelLogResponseWrapper> {
        return this.httpClient.post<FuelLogResponseWrapper>(`/api/fuel/logs/search`, {
            rows_per_page, page, user_id, vehicle_id
        });
    }

    getFuelLogById(log_id: string, user_id: string, vehicle_id: string) {
        return this.httpClient.post<FuelLog>(`/api/fuel/log`, {
            log_id, user_id, vehicle_id
        });
    }

    // newFuelLog(): Observable<FuelLog> {}

    // createFuelLog(log: FuelLogRequest): Observable<any> {
    //     this.fuellogs$.pipe(
    //         take(1),
    //         switchMap(logs => this.httpClient.post<any>(`/api/vehicle`, log).pipe(
    //             catchError(response => { throw new Error(`Error: ${response.error}`) }),
    //             map((newLog) => {
    //                 this.fuellogs$.next(this.sortFuelLogs([...logs, newLog]));
    //                 return newLog;
    //             })
    //         ))
    //     ).subscribe((log) => {
    //         this.fuellog$.next(log);
    //     });
    //     return this.fuellog$;
    // }

    createFuelLog(log: FuelLog, user_id: string, vehicle_id: string, page: number, rows_per_page: number) {
        log = {
            "purchase_date": "2022-05-07",
            "gallons": 11.431,
            "fuel_cost": "56",
            "odometer": 104171,
            "octane": {
                "id": "2eb5d5fd-250a-4cc5-92be-0ae0ea663c1a"
            },
            "brand": {
                "id": "899e2227-3289-467f-9b50-4b94e1638e10"
            },
            "station": {
                "id": "8ad3ed81-7d7d-4fa3-9eb4-2bb8092bf1d4"
            },
            "is_partial_fill": "1",
            "is_ethonal_free": "0",
            "is_excluded": "0"
        }

        return this.httpClient.post<FuelLogResponseWrapper>(`/api/fuel/logs`, { log, user_id, vehicle_id, rows_per_page, page });
    }

    updateFuelLog(log: FuelLog, user_id: string, vehicle_id: string, page: number, rows_per_page: number) {
        return this.httpClient.put<FuelLogResponseWrapper>(`/api/fuel/logs`, { log, user_id, vehicle_id, rows_per_page, page });
    }

    deleteFuelLog(
        log_id: string,
        user_id: string,
        page: number = 1,
        rows_per_page: number = 20
    ) {
        return this.httpClient.delete<FuelLogResponseWrapper>(`/api/fuel/logs`, { body: { log_id, user_id, page, rows_per_page } });
    }

}