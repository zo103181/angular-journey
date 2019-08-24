import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoggingService {

    constructor() { }

    logError(error: Error | HttpErrorResponse) {
        // This will be replaced with logging to either Rollbar, Sentry, Bugsnag, ect.
        if (error instanceof HttpErrorResponse) {
            console.error(error);
        } else {
            console.error(error);
        }
    }
}