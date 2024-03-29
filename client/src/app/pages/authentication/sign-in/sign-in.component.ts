import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from '../../../core/auth/authentication.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {
  signInForm: FormGroup;

  signInValidation = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Please enter a valid email address' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' }
    ]
  };

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(5)])
    });
  }

  onSignInWithEmail() {
    this.auth.signInWithEmail(
      this.signInForm.value.email,
      this.signInForm.value.password
    );
  }

  onSignInWithGoogle() {
    this.auth.signInWithGoogle();
  }
}
