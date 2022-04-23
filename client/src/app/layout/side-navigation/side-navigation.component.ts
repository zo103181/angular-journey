import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { Subject } from 'rxjs';

import { LayoutService } from '../../shared/services/layout.service';
import { CustomBreakpointNames } from '../../shared/services/breakpoints.service';
import { Panel } from '../../core/models/panel.interface';
import { Router } from "@angular/router";

@Component({
    selector: 'side-navigation-layout',
    templateUrl: './side-navigation.component.html'
})
export class SideNavigationLayoutComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;

    panels: Panel[] = [];
    selectedPanel: string = '';

    private _unsubscribeAll = new Subject<any>();

    constructor(
        private layoutService: LayoutService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router
    ) { }


    ngOnInit(): void {
        // Setup available panels
        switch (true) {
            case this.router.url.includes('/garage'):
                this.selectedPanel = 'garage'
                break;
        }

        this.panels = [
            {
                id: 'garage',
                icon: 'heroicons_outline:home',
                title: 'Garage',
                urlPath: '/garage'
            }
        ];
    }

    ngAfterViewInit(): void {
        this.layoutService.subscribeToLayoutChanges().subscribe(observerResponse => {
            // You will have all matched breakpoints in observerResponse
            switch (true) {
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['sm'])):
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['md'])):
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['lg'])):
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['xl'])):
                    if (this.drawer.opened && this.drawerMode === 'over') { break; }

                    this.drawerMode = 'over';
                    if (this.drawer.mode !== this.drawerMode) { this.drawer.mode = this.drawerMode; };
                    this.drawer.toggle(false, 'program');
                    break;
                case (this.layoutService.isBreakpointActive(CustomBreakpointNames['2xl'])):
                default:
                    this.drawerMode = 'side';
                    if (this.drawer.mode !== this.drawerMode) { this.drawer.mode = this.drawerMode; };
                    if (!this.drawer.opened) { this.drawer.toggle(true, 'program'); }
                    break;

            }

            this.changeDetectorRef.detectChanges();
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }
}