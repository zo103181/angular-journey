import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Firebase
import { firebase } from '@firebase/app';
import '@firebase/auth';

// Angularfire2
import { AngularFireAuth } from '@angular/fire/auth';

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
        private afAuth: AngularFireAuth,
        private http: HttpClient,
        private router: Router,
        private injector: Injector
    ) {
        this.notifier = this.injector.get(NotificationService);
        this.verifyUserRedirect();
    }

    async loginWithEmail(email: string, password: string): Promise<void> {
        await this.afAuth.auth.signInWithEmailAndPassword(
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
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        await this.afAuth.auth.signInWithRedirect(provider);
    }

    async verifyPasswordResetCode(code: string): Promise<any> {
        return await this.afAuth.auth.verifyPasswordResetCode(code).then((email) => {
            return email;
        }).catch((error) => {
            console.log(error.message);
        });
    }

    async confirmPasswordReset(code: string, newPassword: string): Promise<boolean> {
        return await this.afAuth.auth.confirmPasswordReset(code, newPassword).then(() => {
            return true;
        }).catch((error) => {
            this.notifier.showError(error.message);
            return false;
        });
    }

    async sendPasswordResetEmail(email: string): Promise<void> {
        await this.afAuth.auth.sendPasswordResetEmail(email).then(() => {
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

        await this.afAuth.auth
          .createUserWithEmailAndPassword(email, password)
          .then((credential) => {
            this.updateUserData(credential.user, registerName).then((result) => {
                this.getCurrentUser();
            }).catch((response) => {
                this.afAuth.auth.signOut();
                // use our notifier to show any errors
                this.notifier.showError(response.error.message);
            });
          })
          .catch((error) => {
            this.afAuth.auth.signOut();
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
        await this.afAuth.auth.signOut().then(() => {
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
        await firebase.auth().getRedirectResult().then(auth => {
            // user property exists; this was a redirect
            if (auth.user) {
                this.updateUserData(auth.user).then((result) => {
                    this.getCurrentUser();
                }).catch((response) => {
                    this.afAuth.auth.signOut();
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
            this.afAuth.auth.signOut();
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
            // get authentication state from AngularFireAuth
            await this.afAuth.authState.subscribe(user => {
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

        const headers = { 'content-type': 'application/json'};
        const body = JSON.stringify(data);

        return await this.http.post<IUser>(this.rootURL + '/user', { user: body }, { headers }).toPromise().then((result) => {
            return result;
        }).catch(error => { throw error });
    }

}