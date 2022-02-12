import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-reset-confirm',
    templateUrl: './reset-confirm.component.html',
    styleUrls: [
        './reset-confirm.component.scss',
        '../authentication.component.scss'
    ]
})
export class ResetConfirmComponent implements OnInit {
    constructor() { }
    ngOnInit(): void { }
}
