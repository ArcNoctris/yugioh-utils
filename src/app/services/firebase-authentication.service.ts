import { Injectable, NgZone } from '@angular/core';
import {
  AuthStateChange,
  FirebaseAuthentication,
  GetIdTokenOptions,
  SignInResult,
  SignInWithPhoneNumberOptions,
  SignInWithPhoneNumberResult,
  User,
  SignInWithEmailAndPasswordOptions,
  
  
} from '@capacitor-firebase/authentication';
import { environment } from '../../environments/environment';
import { initializeApp } from '@firebase/app';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import {AuthService} from './auth.service'
import{FirebaseCommunicationService} from './firebase-communication.service'
import { signInWithEmailAndPassword, sendEmailVerification} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class FirebaseAuthenticationService {
  private readonly authStateSubj = new Subject<AuthStateChange>();

  constructor(
    private readonly platform: Platform,
    private readonly ngZone: NgZone,
    private as: AuthService,
    private fcs: FirebaseCommunicationService
  ) {
    FirebaseAuthentication.removeAllListeners().then(() => {
      FirebaseAuthentication.addListener('authStateChange', (change) => {
        this.ngZone.run(() => {
          this.authStateSubj.next(change);
        });
      });
    });
  }

  public get authState$(): Observable<AuthStateChange> {
    return this.authStateSubj.asObservable();
  }

  public async initialize(): Promise<void> {
    if (this.platform.is('capacitor')) {
      return;
    }
    /**
     * Only needed if the Firebase JavaScript SDK is used.
     *
     * Read more: https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
     */
    initializeApp(environment.firebase);
  }

  public async getCurrentUser(): Promise<User | null> {
    const result = await FirebaseAuthentication.getCurrentUser();
    return result.user;
  }

  public async getIdToken(options?: GetIdTokenOptions): Promise<string> {
    const result = await FirebaseAuthentication.getIdToken(options);
    return result.token;
  }

  public async setLanguageCode(languageCode: string): Promise<void> {
    await FirebaseAuthentication.setLanguageCode({ languageCode });
  }

  public async signInWithApple(): Promise<void> {
    await FirebaseAuthentication.signInWithApple();
  }

  public async signInWithFacebook(): Promise<void> {
    await FirebaseAuthentication.signInWithFacebook();
  }

  public async signInWithGithub(): Promise<void> {
    await FirebaseAuthentication.signInWithGithub();
  }

  public async signInWithGoogle(): Promise<void> {
    let sir = await FirebaseAuthentication.signInWithGoogle();
    sir.credential.accessToken
    await this.as.googleSignIn(sir.credential.idToken)
    await this.fcs.createUserEntry()
    //return sir;
  }

  public async signInWithMicrosoft(): Promise<void> {
    await FirebaseAuthentication.signInWithMicrosoft();
  }
  public async signUpWithMail(email, password, username) {
    let sir = await FirebaseAuthentication.createUserWithEmailAndPassword({email:email,password:password})
    await this.as.signUpWithMail(email,password,username)
    //let options:SignInWithEmailAndPasswordOptions = {email:email, password:password}
    //await FirebaseAuthentication.createUserWithEmailAndPassword(options)
    //FirebaseAuthentication.sendEmailVerification()

  }
  public async signInWithMail(email: string, password:string):Promise<void>{
    console.log("this?"+ email + password)
    let options:SignInWithEmailAndPasswordOptions = {email:email,password:password}
    let sir = await FirebaseAuthentication.signInWithEmailAndPassword({email:email,password:password})
    console.log("this?2")
    await this.as.signInWithMail(email,password)
    console.log("this?3")
    await this.fcs.createUserEntry()
    
    //return sir
  }

  public async signInWithPlayGames(): Promise<void> {
    await FirebaseAuthentication.signInWithPlayGames();
  }

  public async signInWithTwitter(): Promise<void> {
    await FirebaseAuthentication.signInWithTwitter();
  }

  public async signInWithYahoo(): Promise<void> {
    await FirebaseAuthentication.signInWithYahoo();
  }

  public async signInWithPhoneNumber(
    options: SignInWithPhoneNumberOptions
  ): Promise<SignInWithPhoneNumberResult> {
    return FirebaseAuthentication.signInWithPhoneNumber(options);
  }

  public async signOut(): Promise<void> {
    await FirebaseAuthentication.signOut();
  }

  public async useAppLanguage(): Promise<void> {
    await FirebaseAuthentication.useAppLanguage();
  }
}
