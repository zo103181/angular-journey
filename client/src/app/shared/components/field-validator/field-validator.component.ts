import { Component, Input, OnDestroy } from "@angular/core";
import { Subject } from "rxjs/internal/Subject";

interface FieldValidator {
    type: string,
    message: string
}

@Component({
    selector: 'field-validator',
    templateUrl: './field-validator.component.html'
})
export class FieldValidatorComponent implements OnDestroy {

    @Input()
    formField: any | undefined

    @Input()
    fieldValidators: FieldValidator[] | undefined

    private _unsubscribeAll = new Subject<any>();

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}