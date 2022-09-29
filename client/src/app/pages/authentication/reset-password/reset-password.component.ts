import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../core/auth/authentication.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
    private code: string;
    codeExpired: boolean = true;
    isLoading: boolean = true;
    isPasswordReset: boolean = false;
    resetPasswordForm: FormGroup;

    resetPasswordValidation = {
        password: [
            { type: 'required', message: 'Password is required' },
            { type: 'minlength', message: 'Password must be at least 5 characters long' }
        ]
    };

    constructor(
        private route: ActivatedRoute,
        public auth: AuthService
    ) { }

    ngOnInit(): void {
        this.resetPasswordForm = new FormGroup({
            email: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
            password: new FormControl<string>('', [Validators.required, Validators.minLength(5)])
        })

        this.route.queryParams.subscribe(params => {
            this.code = params['oobCode'];
            if (this.code) {
                this.auth.verifyPasswordResetCode(this.code).then((email) => {
                    if (email) {
                        this.codeExpired = false;
                        this.resetPasswordForm = new FormGroup({
                            email: new FormControl<string>({ value: email, disabled: true }, []),
                            password: new FormControl<string>('', [Validators.required, Validators.minLength(5)])
                        })
                    } else { this.codeExpired = true; }
                    this.isLoading = false;
                })
            } else {
                this.codeExpired = true;
                this.isLoading = false;
                this.isPasswordReset = false;
            }
        });
    }

    confirmPasswordReset() {
        this.auth.confirmPasswordReset(this.code, this.resetPasswordForm.value.password).then((result) => {
            this.isPasswordReset = result;
        });
    }
}
