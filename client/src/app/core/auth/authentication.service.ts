import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

// Firebase
import {
    Auth,
    GoogleAuthProvider,
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    getRedirectResult,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithRedirect,
    signOut,
    verifyPasswordResetCode
} from '@angular/fire/auth'

// Services
import { NotificationService } from '../../shared/services/notification.service';
import { UserService } from '../user/user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    notifier: NotificationService;
    isLoading: boolean = false;

    constructor(
        private auth: Auth,
        private router: Router,
        private userService: UserService,
        private injector: Injector
    ) {
        this.notifier = this.injector.get(NotificationService);
        this.verifyUserRedirect();
    }

    async signInWithEmail(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(
            this.auth,
            email,
            password
        ).then(credential => {
            firstValueFrom(this.userService.update(credential.user)).then(() => {
                this.getCurrentUser();
            }, error => {
                this.isLoading = false;
                this.notifier.showError(error.message);
            });
        }).catch((error) => {
            this.notifier.showError(error.message);
        });
    }

    async signInWithGoogle(): Promise<void> {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        await signInWithRedirect(this.auth, provider);
    }

    async verifyPasswordResetCode(code: string): Promise<any> {
        return await verifyPasswordResetCode(this.auth, code).then((email) => {
            return email;
        }).catch((error) => {
            console.log(error.message);
        });
    }

    async confirmPasswordReset(code: string, newPassword: string): Promise<boolean> {
        return await confirmPasswordReset(this.auth, code, newPassword).then(() => {
            return true;
        }).catch((error) => {
            this.notifier.showError(error.message);
            return false;
        });
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        await sendPasswordResetEmail(this.auth, email).then(() => {
            this.router.navigate(['auth/reset-confirm']);
        }).catch((error) => {
            this.notifier.showError(error.message);
        });
    }

    async signUpWithEmail(
        name: string,
        email: string,
        password: string
    ): Promise<void> {
        const signUpName = name;

        // Clear local storage
        localStorage.clear();

        await createUserWithEmailAndPassword(this.auth, email, password)
            .then((credential) => {
                firstValueFrom(
                    this.userService.update(credential.user, signUpName)
                ).then(() => {
                    this.getCurrentUser();
                }).catch((response) => {
                    signOut(this.auth);
                    // use our notifier to show any errors
                    this.notifier.showError(response.error.message);
                });
            })
            .catch((error) => {
                signOut(this.auth);
                // use our notifier to show any errors
                this.notifier.showError(error.message);
            }).finally(() => {
                // hide the progress spinner
                this.isLoading = false;
            });
    }

    async signOut(): Promise<void> {
        // show the progress spinner
        this.isLoading = true;
        await signOut(this.auth).then(() => {
            // clear the user information and local storage
            this.userService.user = null;
            localStorage.clear();
            // hide the progress spinner
            this.isLoading = false;
        }, error => {
            // use our notifier to show any errors
            this.notifier.showError(error.message);
            // hide the progress spinner
            this.isLoading = false;
        });
    }

    async verifyUserRedirect(): Promise<void> {
        // show the progress spinner
        this.isLoading = true;

        await getRedirectResult(this.auth).then(auth => {
            // user property exists; this was a redirect
            console.log('auth', auth);
            if (auth) {
                firstValueFrom(
                    this.userService.update(auth.user)
                ).then(() => {
                    this.getCurrentUser();
                }).catch((response) => {
                    signOut(this.auth);
                    // use our notifier to show any errors
                    this.notifier.showError(response.error.message);
                });
            } else {
                // this was not a redirect; 
                // use our method to check for user
                // in local storage
                this.getCurrentUser();
            }
        }).catch((response) => {
            signOut(this.auth);
            // use our notifier to show any errors
            this.notifier.showError(response.message);
        }).finally(() => {
            // hide the progress spinner
            this.isLoading = false;
        });
    }

    async getCurrentUser() {
        // get the local storage information by key
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser === null) {
            // information not stored in local storage; 
            // get authentication state
            await this.auth.onAuthStateChanged(user => {
                if (user) {
                    // user was authenticated, set values
                    const userObj = {
                        'uid': user.uid,
                        'email': user.email,
                        'photoURL': user.photoURL,
                        'displayName': user.displayName,
                        'emailVerified': user.emailVerified
                    };

                    // set and store information locally
                    this.userService.user = userObj;
                    localStorage.setItem('user', JSON.stringify(userObj));

                    // route authenticated user to appropriate page
                    if (this.router.url === '/auth/sign-in' ||
                        this.router.url === '/auth/sign-up') {
                        // user logging in, so take them to default page
                        this.router.navigate(['dashboard']);
                    }
                    // hide the progress spinner
                    this.isLoading = false;
                } else {
                    // user not authenticated, so NULL the value
                    this.userService.user = null;
                    // store null information locally
                    localStorage.setItem('user', null);
                    // hide the progress spinner
                    this.isLoading = false;
                }
            });
        } else {
            // information already stored locally, so set to user variable
            this.userService.user = localUser;

            // route authenticated user to appropriate page
            if (this.router.url === '/auth/sign-in' ||
                this.router.url === '/auth/sign-up') {
                // user logging in, so take them to default page
                this.router.navigate(['dashboard']);
            }

            // hide the progress spinner
            this.isLoading = false;
        }
    }
}