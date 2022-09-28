import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FieldValidatorComponent } from "./field-validator.component";

@NgModule({
    declarations: [FieldValidatorComponent],
    imports: [CommonModule],
    exports: [FieldValidatorComponent]
})
export class FieldValidatorModule { }