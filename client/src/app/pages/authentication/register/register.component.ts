import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Services
import { AuthService } from '../../../shared/services/authentication.service';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../authentication.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hideTerms: boolean;

  private unsubscribeAll: Subject<any>;

  registerValidation = {
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
  };

  constructor(private formBuilder: FormBuilder, protected auth: AuthService) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.hideTerms = true;

    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, confirmPasswordValidator]],
      terms: [false, Validators.requiredTrue],
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.registerForm
      .get('password')
      .valueChanges.pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.registerForm.get('passwordConfirm').updateValueAndValidity();
      });
  }

  onToggleTerms(acceptTerms?: boolean): boolean {
    if (acceptTerms !== undefined) {
      this.registerForm.get('terms').setValue(acceptTerms);
    }
    this.hideTerms = !this.hideTerms;
    return false;
  }

  onUserRegister() {
    this.auth.registerWithEmail(
      this.registerForm.value.name,
      this.registerForm.value.email,
      this.registerForm.value.password
    );
  }
}
