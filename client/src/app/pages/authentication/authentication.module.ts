import { NgModule } from '@angular/core';

import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { ForgotPasswordModule } from './forgot-password/forgot-password.module';
import { ResetConfirmModule } from './reset-confirm/reset-confirm.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';

@NgModule({
    imports: [
        RegisterModule,
        LoginModule,
        ForgotPasswordModule,
        ResetConfirmModule,
        ResetPasswordModule,
    ]
})
export class AuthenticationModule {}