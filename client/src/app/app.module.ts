import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Firebase
import {
  initializeApp,
  provideFirebaseApp
} from '@angular/fire/app';
import {
  provideAuth,
  getAuth
} from '@angular/fire/auth';
import {
  provideFirestore,
  getFirestore
} from '@angular/fire/firestore'

// Environments
import { environment } from '../environments/environment';

// Services
import { AuthService } from './core/auth/authentication.service';

// Providers
import { ErrorsHandler } from './shared/providers/error-handler';
import { HttpsInterceptor } from './shared/providers/http-interceptor';

// Shared
import { SharedModule } from './shared/shared.module';

// Page Layout
import { PageLayoutModule } from './layout/page-layout.module';

// Core
import { CoreModule } from './core/core.module';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routing';

const routerConfig: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes, routerConfig),

    // Firebase Modules
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    HttpClientModule,
    SharedModule,
    CoreModule,
    LayoutModule,
    PageLayoutModule
  ],
  providers: [
    AuthService,
    { provide: ErrorHandler, useClass: ErrorsHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
