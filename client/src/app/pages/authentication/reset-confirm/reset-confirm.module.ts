import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { ResetConfirmComponent } from './reset-confirm.component';

const routes = [{
    path: 'reset-confirm',
    component: ResetConfirmComponent
}];

@NgModule({
    declarations: [ResetConfirmComponent],
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ]
})
export class ResetConfirmModule {}
