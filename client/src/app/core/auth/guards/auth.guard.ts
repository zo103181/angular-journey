import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { Observable, of } from 'rxjs';

import { AuthService } from '../authentication.service'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
        if (this.auth.isLoggedIn) {
            return of(true);
        } else {
            this.router.navigate(['auth/sign-in']);
            return of(false);
        }
    }
}
