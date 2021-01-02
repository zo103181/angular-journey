import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";

import { RegisterComponent } from "./register.component";

const routes = [
  {
    path: "register",
    component: RegisterComponent,
  },
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class RegisterModule {}
