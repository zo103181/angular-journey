import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SharedMaterialModule } from './shared-material.module';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
    imports: [
        CommonModule,
        FlexLayoutModule,
        SharedMaterialModule
    ],
    declarations: [
        NavComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        SharedMaterialModule,
        NavComponent,
    ]
})
export class SharedModule { }
