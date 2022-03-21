import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user.interface';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _user = new ReplaySubject<User>(1);

    constructor(
        private httpClient: HttpClient
    ) { }

    /**
     * Setting & getting for user
     * @param value
     */
    set user(value: User) { this._user.next(value); }
    get user$(): Observable<User> {
        this.user = JSON.parse(localStorage.getItem('user'));
        return this._user.asObservable();
    }

    update(user: User, registrationName?: string): Observable<any> {
        const headers = { 'content-type': 'application/json' };
        if (registrationName) { user.displayName = registrationName }
        const body = JSON.stringify(user);

        return this.httpClient.post<User>('/api/user', { user: body }, { headers }).pipe(
            map((response) => {
                localStorage.setItem('user', JSON.stringify(response));
                this._user.next(response);
            })
        );
    }
}