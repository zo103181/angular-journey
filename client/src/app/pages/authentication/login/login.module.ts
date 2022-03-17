import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';

const routes = [{
    path: 'login',
    component: LoginComponent
}];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class LoginModule { }
