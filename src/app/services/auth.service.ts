import { Injectable } from '@angular/core';
//import { Auth } from '@angular/fire/auth'
//import { Firestore, DocumentReference } from '@angular/fire/firestore'
import { FirebaseApp } from '@firebase/app'
import '@firebase/auth'
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
//import { User } from './user.model'


import { Component } from '@angular/core';
import { getAuth, GoogleAuthProvider, Auth, signInWithRedirect, getRedirectResult, signInWithPopup , signInWithCredential, User, onAuthStateChanged, authState} from '@angular/fire/auth';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<User>;
  constructor(
    private afa: Auth,
    private afs: Firestore,
    private router: Router,

  ) {
    this.user$ = authState(getAuth())
    


  
  }
  async googleSignIn(token:string): Promise<void> {
   
    let uc = await signInWithCredential(getAuth(this.afa.app), GoogleAuthProvider.credential(token))
    //this.user$ = uc
    this.router.navigate(['/profile'])
  


    //return this.updateUserData(credential.user);
  }
  async signOut() {
    await this.afa.signOut()
    this.user$ = undefined
    return this.router.navigate(['/login'])
  }
  private updateUserData(user: any) {
    //const userRef: AngularFirestoreDocument<any> = this.afs.doc(`user/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    }
    //return userRef.set(data, {merge:true})
  }

}
