import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'page-layout',
    templateUrl: './page-layout.component.html',
    styleUrls: ['./page-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PageLayoutComponent implements OnInit {
    layout: 'empty' | 'side-navigation'

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit(): void {
        let route = this.activatedRoute;

        const paths = route.pathFromRoot;
        paths.forEach((path) => {
            if (path.routeConfig && path.routeConfig.data && path.routeConfig.data.layout) {
                this.layout = path.routeConfig.data.layout;
            }
        });
    }
}