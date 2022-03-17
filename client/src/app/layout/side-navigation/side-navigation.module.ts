import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SideNavigationLayoutComponent } from "./side-navigation.component";
import { UserModule } from "../common/user/user.module"
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    declarations: [SideNavigationLayoutComponent],
    imports: [
        RouterModule,
        MatMenuModule,
        MatSidenavModule,
        MatSlideToggleModule,
        UserModule,
        SharedModule
    ],
    exports: [SideNavigationLayoutComponent]
})
export class SideNavigationLayoutModule { }