import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, Subject, takeUntil, takeWhile, tap, timer } from 'rxjs';

// Services
import { AuthService } from '../../../core/auth/authentication.service';

@Component({
    selector: 'app-sign-out',
    templateUrl: './sign-out.component.html'
})
export class SignOutComponent implements OnInit, OnDestroy {
    countdown: number = 5;
    countdownMapping: any = {
        '=1': '# second',
        'other': '# seconds'
    };
    private unsubscribeAll = new Subject<any>();

    constructor(
        public auth: AuthService,
        private _router: Router
    ) { }

    ngOnInit(): void {
        this.auth.signOut();

        // Redirect after the countdown
        timer(1000, 1000)
            .pipe(
                finalize(() => {
                    this._router.navigate(['auth/sign-in']);
                }),
                takeWhile(() => this.countdown > 0),
                takeUntil(this.unsubscribeAll),
                tap(() => this.countdown--)
            )
            .subscribe();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }
}
