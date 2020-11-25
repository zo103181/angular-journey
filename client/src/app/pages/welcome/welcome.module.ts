import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { FooterComponent } from '../../shared/components/footer/footer.component';

import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { WelcomeComponent } from './welcome.component';

const routes: Routes = [
    { path: '', component: WelcomeComponent}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports: [],
    declarations: [
        HeaderComponent,
        MainComponent,
        FooterComponent,
        WelcomeComponent
    ],
    providers: []
})
export class WelcomeModule {}
