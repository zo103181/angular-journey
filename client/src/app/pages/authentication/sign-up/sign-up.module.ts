import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FieldValidatorModule } from "src/app/shared/components/field-validator/field-validator.module";

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
  imports: [SharedModule, RouterModule.forChild(routes), FieldValidatorModule],
})
export class SignUpModule { }
