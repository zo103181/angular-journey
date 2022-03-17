import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'landing-home',
    styleUrls: ['./home.component.scss'],
    templateUrl: './home.component.html'
})
export class LandingHomeComponent {

    constructor(
        private router: Router
    ) { }

    goToLogin() {
        // routes the user to login page
        this.router.navigate(['auth/login']);
    }

}