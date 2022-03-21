import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../core/models/user.interface';
import { UserService } from '../../../core/user/user.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    @Input() showAvatar: boolean = true;
    user: User;

    private unsubscribeAll = new Subject<any>();

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                // Mark for check
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }

    onLogout(): void {
        this.router.navigate(['auth/sign-out']);
    }
}
