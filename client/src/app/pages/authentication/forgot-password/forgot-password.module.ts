import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes = [{
    path: 'forgot-password',
    component: ForgotPasswordComponent
}];

@NgModule({
    declarations: [ForgotPasswordComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ForgotPasswordModule {}
