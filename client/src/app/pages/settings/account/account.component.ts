import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { firstValueFrom, Subject } from 'rxjs';
import { User } from 'src/app/core/models/user.interface';
import { UserService } from 'src/app/core/user/user.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html'
})
export class SettingsAccountComponent implements OnInit, OnDestroy {
    accountForm: FormGroup;

    @Input() user: User

    private unsubscribeAll = new Subject<any>();

    formValidation = {
        name: [
            { type: 'required', message: 'Name is required' }
        ],
        email: [
            { type: 'required', message: 'Email is required' }
        ]
    };

    constructor(
        private notifier: NotificationService,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.accountForm = new FormGroup({
            name: new FormControl<string>(this.user.displayName, Validators.required),
            email: new FormControl<string>({ value: this.user.email, disabled: true }, Validators.required)
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    onCancelSave(): void {
        this.accountForm.controls['name'].setValue(this.user.displayName);
    }

    onSaveAccount(): void {
        firstValueFrom(
            this.userService.update({ ...this.user, displayName: this.accountForm.controls['name'].value })
        ).then(() => {
            this.notifier.showError('Save Successful');
        }).catch((response) => {
            // use our notifier to show any errors
            console.error(response);
            this.notifier.showError(response.error);
        });
    }
}
