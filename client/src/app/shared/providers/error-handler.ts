import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

// Services
import { NotificationService } from '../services/notification.service';
import { LoggingService } from '../services/logging.service';
import { FirebaseError } from 'firebase/app';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse | FirebaseError) {

        const notifier = this.injector.get(NotificationService);
        const logger = this.injector.get(LoggingService);

        if (!navigator.onLine) {
            // Handle offline error
            notifier.showError('Browser Offline!');
        } else {
            if (error instanceof HttpErrorResponse) {
                // Handle Http Error (4xx, 5xx, ect.)
                notifier.showError('Http Error: ' + error.message);
            } else if (error instanceof FirebaseError) {
                // Handle Firebase Error
                notifier.showError(`Firebase Setup: ${error.message}`);
            } else {
                // Handle Client Error (Angular Error, ReferenceError...)
                notifier.showError(error.message);
            }
            // Always log the error
            logger.logError(error);
        }
    }
}
