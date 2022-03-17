import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";
import { FooterComponent } from "../../../shared/components/footer/footer.component";
import { LandingHomeComponent } from "./home.component";
import { landingHomeRoutes } from "./home.routing";

@NgModule({
    declarations: [
        FooterComponent,
        LandingHomeComponent
    ],
    imports: [
        RouterModule.forChild(landingHomeRoutes),
        SharedModule
    ]
})
export class LandingHomeModule { }