import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FirebaseError } from 'firebase/app';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor() { }

    logError(error: Error | HttpErrorResponse | FirebaseError) {
        // This will be replaced with logging to either Rollbar, Sentry, Bugsnag, ect.
        if (error instanceof FirebaseError) {
            console.error('FirebaseError:', error);
        } else if (error instanceof HttpErrorResponse) {
            console.error('HttpErrorResponse:', error);
        } else {
            console.error(error);
        }
    }
}