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

    goToSignIn() {
        this.router.navigate(['auth/sign-in']);
    }

}