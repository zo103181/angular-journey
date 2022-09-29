import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Services
import { AuthService } from '../../../core/auth/authentication.service';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }
  if (passwordConfirm.value === '') {
    return null;
  }
  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  hideTerms: boolean;

  private unsubscribeAll: Subject<any>;

  signUpValidation = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 3 characters long' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email' },
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 6 characters long',
      },
    ],
    passwordConfirm: [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'passwordsNotMatching', message: 'Passwords must match' },
    ],
    terms: [
      { type: 'required', message: 'You must accept the Terms and Conditions' }
    ]
  };

  constructor(protected auth: AuthService) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.hideTerms = true;

    this.signUpForm = new FormGroup({
      name: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
      passwordConfirm: new FormControl<string>('', [Validators.required, confirmPasswordValidator]),
      terms: new FormControl<boolean>(false, Validators.requiredTrue),
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.signUpForm
      .get('password')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.signUpForm.get('passwordConfirm').updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  onToggleTerms(acceptTerms?: boolean): boolean {
    if (acceptTerms !== undefined) {
      this.signUpForm.get('terms').setValue(acceptTerms);
    }
    this.hideTerms = !this.hideTerms;
    return false;
  }

  onUserSignUp() {
    this.auth.signUpWithEmail(
      this.signUpForm.value.name,
      this.signUpForm.value.email,
      this.signUpForm.value.password
    );
  }
}
