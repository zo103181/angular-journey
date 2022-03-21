import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
        private formBuilder: FormBuilder,
        protected auth: AuthService
    ) {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit(): void {
    }

    onSendResetLink(): void {
        this.auth.sendPasswordResetEmail(this.forgotPasswordForm.value.email);
    }

}
