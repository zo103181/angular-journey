import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FieldValidatorModule } from 'src/app/shared/components/field-validator/field-validator.module';

import { SharedModule } from '../../../shared/shared.module';

import { ResetPasswordComponent } from './reset-password.component';

const routes = [{
    path: 'reset-password',
    component: ResetPasswordComponent
}];

@NgModule({
    declarations: [ResetPasswordComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FieldValidatorModule
    ]
})
export class ResetPasswordModule { }
