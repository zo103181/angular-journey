import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
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
