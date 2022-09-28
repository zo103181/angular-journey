import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FieldValidatorModule } from 'src/app/shared/components/field-validator/field-validator.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignInComponent } from './sign-in.component';

const routes = [{
    path: 'sign-in',
    component: SignInComponent
}];

@NgModule({
    declarations: [SignInComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
        FieldValidatorModule
    ]
})
export class SignInModule { }
