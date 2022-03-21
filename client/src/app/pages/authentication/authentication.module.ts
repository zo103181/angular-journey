import { NgModule } from '@angular/core';

import { SignUpModule } from './sign-up/sign-up.module';
import { SignInModule } from './sign-in/sign-in.module';
import { SignOutModule } from './sign-out/sign-out.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetConfirmModule } from './reset-confirm/reset-confirm.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@NgModule({
    imports: [
        SignUpModule,
        SignInModule,
        SignOutModule,
        ForgotPasswordModule,
        ResetConfirmModule,
        ResetPasswordModule,
    ]
})
export class AuthenticationModule { }