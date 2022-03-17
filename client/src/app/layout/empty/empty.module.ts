import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";
import { EmptyLayoutComponent } from "./empty.component";

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
    ],
    exports: [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule { }
