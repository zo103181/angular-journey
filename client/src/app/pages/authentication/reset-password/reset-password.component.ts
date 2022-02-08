import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/shared/services/authentication.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: [
        './reset-password.component.scss',
        '../authentication.component.css'
    ]
})
export class ResetPasswordComponent implements OnInit {
    private code: string;
    private codeExpired: boolean = true;
    private isLoading: boolean = true;
    private isPasswordReset: boolean = false;
    resetPasswordForm: FormGroup;

    resetPasswordValidation = {
        password: [
          { type: 'required', message: 'Password is required' },
          { type: 'minlength', message: 'Password must be at least 5 characters long' }
        ]
      };

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute, 
        public auth: AuthService
    ) { }
    
    ngOnInit(): void { 
        this.resetPasswordForm = this.formBuilder.group({
            email: [{value: '', disabled: true}, []],
            password: ['', [Validators.required, Validators.minLength(5)]]
        })

        this.route.queryParams.subscribe(params => {
            this.code = params['oobCode'];
            if (this.code) {
                this.auth.verifyPasswordResetCode(this.code).then((email) => {
                    if (email) {
                        this.codeExpired = false;
                        this.resetPasswordForm = this.formBuilder.group({
                            email: [{value: email, disabled: true}, []],
                            password: ['', [Validators.required, Validators.minLength(5)]]
                        })
                    } else { this.codeExpired = true; }
                    this.isLoading = false;
                })
            }
          });
    }

    confirmPasswordReset() {
        this.auth.confirmPasswordReset(this.code, this.resetPasswordForm.value.password).then((result) => {
            this.isPasswordReset = result;
        });
    }
}
