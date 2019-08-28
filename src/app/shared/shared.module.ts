import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from './shared-material.module';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        RouterModule,
        SharedMaterialModule
    ],
    declarations: [
        NavComponent
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        SharedMaterialModule,
        NavComponent,
    ]
})
export class SharedModule { }
