import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { SharedModule } from "../../../shared/shared.module";

import { SignUpComponent } from "./sign-up.component";

const routes = [
  {
    path: "sign-up",
    component: SignUpComponent,
  },
];

@NgModule({
  declarations: [SignUpComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SignUpModule { }
