import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/authentication.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

    constructor(
        public auth: AuthService,
        private router: Router,
    ) { }

    ngOnInit() {
    }

    goToLogin() {
        // routes the user to login page
        this.router.navigate(['auth/login']);
    }

    onLogout() {
        this.auth.logout().then(() => {
            // routes the user to root page
            this.router.navigate(['']);
        });
    }

}
