import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
    exports: [
        MatButtonModule,
        MatSnackBarModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule
    ]
})
export class SharedMaterialModule { }
