import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { SignOutComponent } from './sign-out.component';

const routes = [{
    path: 'sign-out',
    component: SignOutComponent
}];

@NgModule({
    declarations: [SignOutComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class SignOutModule { }
