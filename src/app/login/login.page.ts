import { Component, OnInit,ViewChild  } from '@angular/core';
import { User } from '@capacitor-firebase/authentication';
import { MenuController } from '@ionic/angular';
import { FirebaseCommunicationService } from '../services/firebase-communication.service';
import { ActionSheetController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';

import { Router } from '@angular/router';
import { FirebaseAuthenticationService } from '../services/firebase-authentication.service';
import { DialogService } from '../services/dialog.service';
import {AuthService} from '../services/auth.service'
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface LoginerOptions {
    value: string;
    viewValue: string;
  }
  interface Loginer {
    name: string;
    lp: number;
    cols: string;
    rows: string;
    class: string;
    background: Promise<string>;
  
  }

@Component({
  selector: 'app-folder',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  ngOnInit(): void {
      
  }
  loginForm
  user:any
  constructor(
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private readonly as: AuthService,
    private readonly dialogService: DialogService,
    private readonly router: Router
  ) {
    let mailFormControl = new FormControl()
    mailFormControl.setValidators(Validators.required)
    mailFormControl.setValidators(Validators.email)
    let passwordFormControl = new FormControl()
    passwordFormControl.setValidators(Validators.required)
    passwordFormControl.setValidators(Validators.minLength(8))
    
    this.loginForm = new FormGroup({
      email:mailFormControl,
      password:passwordFormControl,
    })
    
    this.user = as.user$
  }
  public async signInWithMail(){
    await this.signInWith(SignInProvider.mail)
  }
  public async signInWithApple(): Promise<void> {
    await this.signInWith(SignInProvider.apple);
  }

  public async signInWithFacebook(): Promise<void> {
    await this.signInWith(SignInProvider.facebook);
  }

  public async signInWithGithub(): Promise<void> {
    //await this.googleSignIn()
    await this.signInWith(SignInProvider.github);
  }

  public async signInWithGoogle(): Promise<void> {
    await this.signInWith(SignInProvider.google);
  }

  public async signInWithMicrosoft(): Promise<void> {
    await this.signInWith(SignInProvider.microsoft);
  }

  public async signInWithPlayGames(): Promise<void> {
    await this.signInWith(SignInProvider.playgames);
  }

  public async signInWithTwitter(): Promise<void> {
    await this.signInWith(SignInProvider.twitter);
  }

  public async signInWithYahoo(): Promise<void> {
    await this.signInWith(SignInProvider.yahoo);
  }

  public async signInWithPhoneNumber(): Promise<void> {
    let loadingElement: HTMLIonLoadingElement | undefined;
    try {
      const phoneNumber = await this.getPhoneNumber();
      if (!phoneNumber) {
        return;
      }
      loadingElement = await this.dialogService.showLoading();
      const { verificationId } =
        await this.firebaseAuthenticationService.signInWithPhoneNumber({
          phoneNumber,
        });
      await loadingElement.dismiss();
      const verificationCode = await this.getVerificationCode();
      if (!verificationCode) {
        return;
      }
      loadingElement = await this.dialogService.showLoading();
      await this.firebaseAuthenticationService.signInWithPhoneNumber({
        verificationId,
        verificationCode,
      });
      //await this.navigateToHome();
    } finally {
      await loadingElement?.dismiss();
    }
  }

  private async signInWith(provider: SignInProvider): Promise<void> {
    const loadingElement = await this.dialogService.showLoading();
    try {
      switch (provider) {
        case SignInProvider.apple:
          await this.firebaseAuthenticationService.signInWithApple();
          break;
        case SignInProvider.facebook:
          await this.firebaseAuthenticationService.signInWithFacebook();
          break;
        case SignInProvider.github:
          await this.firebaseAuthenticationService.signInWithGithub();
          break;
        case SignInProvider.google:
          await this.firebaseAuthenticationService.signInWithGoogle()
          // if (result.credential?.idToken != null){
          // await this.as.googleSignIn(result.credential?.idToken);}
          break;
        case SignInProvider.microsoft:
          await this.firebaseAuthenticationService.signInWithMicrosoft();
          break;
        case SignInProvider.playgames:
          await this.firebaseAuthenticationService.signInWithPlayGames();
          break;
        case SignInProvider.twitter:
          await this.firebaseAuthenticationService.signInWithTwitter();
          break;
        case SignInProvider.yahoo:
          await this.firebaseAuthenticationService.signInWithYahoo();
          break;
        case SignInProvider.mail:
          let email = this.loginForm.value.email
          let password = this.loginForm.value.password
          await this.firebaseAuthenticationService.signInWithMail(email, password);

          // if (result.credential?.idToken != null){
          // await this.as.signInWithMail(result.credential?.idToken);}
          break;
      }
      await this.navigateToHome();
    } finally {
      await loadingElement.dismiss();
    }
  }

  private async navigateToHome(): Promise<void> {
    await this.router.navigate(['/'], { replaceUrl: true });
  }

  private async getPhoneNumber(): Promise<string | undefined> {
    const data = await this.dialogService.showInputAlert({
      inputs: [
        {
          name: 'phoneNumber',
          type: 'text',
          placeholder: 'Phone Number',
        },
      ],
    });
    if (!data) {
      return;
    }
    return data.phoneNumber;
  }

  private async getVerificationCode(): Promise<string | undefined> {
    const data = await this.dialogService.showInputAlert({
      inputs: [
        {
          name: 'verificationCode',
          type: 'text',
          placeholder: 'Verification Code',
        },
      ],
    });
    if (!data) {
      return;
    }
    return data.verificationCode;
  }
}

enum SignInProvider {
  apple = 'apple',
  facebook = 'facebook',
  github = 'github',
  google = 'google',
  microsoft = 'microsoft',
  playgames = 'playgames',
  twitter = 'twitter',
  yahoo = 'yahoo',
  mail = 'mail'

}