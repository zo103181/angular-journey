import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
    ]
})
export class SignInModule { }
