import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html'
})
export class SettingsAccountComponent implements OnInit {
    accountForm: FormGroup;

    formValidation = {
        name: [
            { type: 'required', message: 'Name is required' }
        ]
    };

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.accountForm = this.formBuilder.group({
            name: ['', Validators.required]
        });
    }
}
