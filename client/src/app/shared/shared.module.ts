import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from './shared-material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedMaterialModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        SharedMaterialModule
    ]
})
export class SharedModule { }
