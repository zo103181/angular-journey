import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
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
import { AuthService } from './shared/services/authentication.service';

// Providers
import { ErrorsHandler } from './shared/providers/error-handler';
import { HttpsInterceptor } from './shared/providers/http-interceptor';

// Shared
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    HttpClientModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    AuthService,
    { provide: ErrorHandler, useClass: ErrorsHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpsInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
