import { Injectable, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/of';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  role: string;
}


@Injectable()
export class AuthService {

  user: Observable<User>;
  name: string;

  @Output() nameEvent = new EventEmitter<string>();

  constructor( private afAuth: AngularFireAuth, private afs: AngularFirestore) {

      //// Get auth data, then get firestore user document || null
      this.user = this.afAuth.authState
      .switchMap(user => {
          if (user) {
            this.name = user.displayName;
            //this.sendName();
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return Observable.of(null)
          }
      });
    }
  
  // sendName() {
  //   this.nameEvent.emit(this.name);
  // }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user)
      })
  }


  private updateUserData(user) {
    // Sets user data to firestore on login

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: user.role
    }

    return userRef.set(data, { merge: true })

  }


  signOut() {
    this.afAuth.auth.signOut();
  }
}