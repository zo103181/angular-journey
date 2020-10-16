import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthService } from 'src/client/app/shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css',
    '../authentication.component.css'
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loginValidation = {
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
    private formBuilder: FormBuilder,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onLoginWithEmail() {
    this.auth.loginWithEmail(
      this.loginForm.value.email,
      this.loginForm.value.password
    );
  }

  onLoginWithGoogle() {
    this.auth.loginWithGoogle();
  }
}
