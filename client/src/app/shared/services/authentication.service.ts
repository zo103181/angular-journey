import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
import { NotificationService } from './notification.service';

// Classes / Interfaces
interface IUser {
    uid: string;
    email: string;
    photoURL?: string;
    displayName?: string;
    emailVerified: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    notifier: NotificationService;
    user: IUser;
    isLoading: boolean = false;
    rootURL = '/api';

    constructor(
        private auth: Auth,
        private http: HttpClient,
        private router: Router,
        private injector: Injector
    ) {
        this.notifier = this.injector.get(NotificationService);
        this.verifyUserRedirect();
    }

    async loginWithEmail(email: string, password: string): Promise<void> {
        await signInWithEmailAndPassword(
            this.auth,
            email,
            password
        ).then(credential => {
            this.updateUserData(credential.user).then(() => {
                this.getCurrentUser();
            }, error => {
                this.isLoading = false;
                this.notifier.showError(error.message);
            });
        }).catch((error) => {
            this.notifier.showError(error.message);
        });
    }

    async loginWithGoogle(): Promise<void> {
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

    async registerWithEmail(
        name: string,
        email: string,
        password: string
    ): Promise<void> {
        const registerName = name;

        // Clear local storage
        localStorage.clear();

        await createUserWithEmailAndPassword(this.auth, email, password)
            .then((credential) => {
                this.updateUserData(credential.user, registerName).then((result) => {
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

    async logout(): Promise<void> {
        // show the progress spinner
        this.isLoading = true;
        await signOut(this.auth).then(() => {
            // clear the user information and local storage
            this.user = null;
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
            if (auth) {
                this.updateUserData(auth.user).then((result) => {
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

    async getCurrentUser(authUser?) {
        // get the local storage information by key
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser === null) {
            // information not stored in local storage; 
            // get authentication state
            await this.auth.onAuthStateChanged(user => {
                if (user) {
                    // user was authenticated, set values
                    this.user = {
                        'uid': user.uid,
                        'email': user.email,
                        'photoURL': user.photoURL,
                        'displayName': user.displayName,
                        'emailVerified': user.emailVerified
                    };
                    // store information locally
                    localStorage.setItem('user', JSON.stringify(this.user));
                    // route authenticated user to appropriate page
                    if (this.router.url === '/auth/login' ||
                        this.router.url === '/auth/register') {
                        // user logging in, so take them to default page
                        this.router.navigate(['']);
                    }
                    // hide the progress spinner
                    this.isLoading = false;
                } else {
                    // user not authenticated, so NULL the value
                    this.user = null;
                    // store null information locally
                    localStorage.setItem('user', JSON.stringify(this.user));
                    // hide the progress spinner
                    this.isLoading = false;
                }
            });
        } else {
            // information already stored locally, so set to user variable
            this.user = localUser;
            // hide the progress spinner
            this.isLoading = false;
        }
    }

    async updateUserData({
        uid,
        email,
        displayName,
        photoURL,
        emailVerified }: IUser,
        registrationName?: string
    ) {
        const data: IUser = {
            uid,
            email,
            displayName: (registrationName) ? registrationName : displayName,
            photoURL,
            emailVerified: emailVerified
        }

        const headers = { 'content-type': 'application/json' };
        const body = JSON.stringify(data);

        return await this.http.post<IUser>(this.rootURL + '/user', { user: body }, { headers }).toPromise().then((result) => {
            return result;
        }).catch(error => { throw error });
    }

}