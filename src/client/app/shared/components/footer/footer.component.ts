import { Component, OnInit, VERSION } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

    social;
    ngVersion;

    constructor() { }

    ngOnInit() {
        // Initialize social link values
        this.social = [{
            url: 'https://www.facebook.com/zrolson',
            css: 'icon-facebook'
        }, {
            url: 'https://www.linkedin.com/in/zrolson/',
            css: 'icon-linkedin'
        }, {
            url: 'mailto:zrolson@gmail.com',
            css: 'icon-email'
        }];

        this.ngVersion = VERSION;
    }

}
