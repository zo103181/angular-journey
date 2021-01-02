import { NgModule } from '@angular/core';

import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';

@NgModule({
    imports: [
        RegisterModule,
        LoginModule
    ]
})
export class AuthenticationModule {}