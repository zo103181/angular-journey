import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';

import { LayoutService } from '../../shared/services/layout.service';
import { UserService } from 'src/app/core/user/user.service';
import { CustomBreakpointNames } from '../../shared/services/breakpoints.service';
import { Panel } from 'src/app/core/models/panel.interface';
import { User } from '../../core/models/user.interface';

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    panels: Panel[] = [];
    selectedPanel: string = 'account';
    user: User;
    private unsubscribeAll = new Subject<any>();

    constructor(
        private layoutService: LayoutService,
        private changeDetectorRef: ChangeDetectorRef,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        // Setup available panels
        this.userService.user$
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                // Mark for check
                this.changeDetectorRef.markForCheck();
            });

        this.panels = [
            {
                id: 'account',
                icon: 'heroicons_outline:user-circle',
                title: 'Account',
                description: 'Manage your public profile and private information'
            },
            {
                id: 'team',
                icon: 'heroicons_outline:user-group',
                title: 'Team',
                description: 'Manage your existing team and change roles/permissions'
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
        this.unsubscribeAll.next(null);
        this.unsubscribeAll.complete();
    }

    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }
}
