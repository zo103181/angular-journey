import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../../core/auth/authentication.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;

    forgotPasswordValidation = {
        email: [
            { type: 'required', message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' }
        ]
    };

    constructor(
        protected auth: AuthService
    ) {
        this.forgotPasswordForm = new FormGroup({
            email: new FormControl<string>('', [Validators.required, Validators.email])
        });
    }

    ngOnInit(): void {
    }

    onSendResetLink(): void {
        this.auth.sendPasswordResetEmail(this.forgotPasswordForm.value.email);
    }

}
