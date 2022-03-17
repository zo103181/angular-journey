import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { EmptyLayoutModule } from "./empty/empty.module";
import { SideNavigationLayoutModule } from "./side-navigation/side-navigation.module";

import { PageLayoutComponent } from "./page-layout.component";

const layoutModules = [
    EmptyLayoutModule,
    SideNavigationLayoutModule
];

@NgModule({
    declarations: [PageLayoutComponent],
    imports: [SharedModule, ...layoutModules],
    exports: [PageLayoutComponent, ...layoutModules]
})
export class PageLayoutModule { }