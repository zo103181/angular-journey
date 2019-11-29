import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import { firebase } from '@firebase/app';
import '@firebase/auth';

// Angularfire2
import { AngularFireAuth } from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';

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
    isLoading: boolean;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
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
                this.updateUserData(auth.user).then(() => {
                    this.getCurrentUser();
                }, error => {
                    // hide the progress spinner
                    this.isLoading = false;
                    // use our notifier to show any errors
                    this.notifier.showError(error.message);
                });
            } else {
                // this was not a redirect; 
                // use our method to check for user
                // in local storage
                this.getCurrentUser();
            }
        }, (error) => {
            // hide the progress spinner
            this.isLoading = false;
            // use our notifier to show any errors
            this.notifier.showError(error.message);
        });
    }

    async getCurrentUser() {
        // get the local storage information by key
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser === null) {
            // information not stored in local storage; 
            // get authentication state from AngularFireAuth
            await this.afAuth.authState.subscribe(user => {
                if (user) {
                    // user was authenitcated, set values
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
                    if (this.router.url === '/auth/login') {
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
        const userRef: AngularFirestoreDocument<IUser> = this.afs.doc(`users/${uid}`);

        const data: IUser = {
            uid,
            email,
            displayName: (registrationName) ? registrationName : displayName,
            photoURL,
            emailVerified: emailVerified
        }

        return await userRef.set(data, { merge: true });
    }

}