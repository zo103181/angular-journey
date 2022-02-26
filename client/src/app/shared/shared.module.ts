import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from './shared-material.module';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedMaterialModule
    ],
    declarations: [
        NavComponent
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        SharedMaterialModule,
        NavComponent,
    ]
})
export class SharedModule { }
