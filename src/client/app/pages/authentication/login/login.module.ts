import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'src/client/app/shared/shared.module';
import { LoginComponent } from './login.component';

const routes = [{
    path: 'login',
    component: LoginComponent
}];

@NgModule({
    declarations: [LoginComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class LoginModule {}
