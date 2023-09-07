import { Component, OnInit,ViewChild  } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { FirebaseCommunicationService } from '../services/firebase-communication.service';
import { ActionSheetController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FirebaseAuthenticationService } from '../services/firebase-authentication.service';
import { DialogService } from '../services/dialog.service';
import { User } from '@capacitor-firebase/authentication';
import {AuthService} from '../services/auth.service'
interface ProfileerOptions {
    value: string;
    viewValue: string;
  }
  interface Profileer {
    name: string;
    lp: number;
    cols: string;
    rows: string;
    class: string;
    background: Promise<string>;
  
  }

@Component({
  selector: 'app-folder',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  public a: any

  public currentUser: User | null = null;
  public idToken = '';
  public languageCode = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly firebaseAuthenticationService: FirebaseAuthenticationService,
    private readonly dialogService: DialogService,
    private readonly router: Router,
    private as: AuthService
  ) {
    this.a = as.user$
    console.log(this.a)
  }

  public ngOnInit(): void {
    this.firebaseAuthenticationService.getCurrentUser().then((user) => {
      this.currentUser = user;
    });
    this.firebaseAuthenticationService.getIdToken().then((idToken) => {
      this.idToken = idToken;
    });
  }

  public async signOut(): Promise<void> {
    const loadingElement = await this.dialogService.showLoading();
    try {
      await this.firebaseAuthenticationService.signOut();
      await this.navigateToLoginPage();
    } finally {
      await loadingElement.dismiss();
    }
  }

  public async refreshIdToken(): Promise<void> {
    const loadingElement = await this.dialogService.showLoading();
    try {
      this.idToken = await this.firebaseAuthenticationService.getIdToken({
        forceRefresh: true,
      });
    } finally {
      await loadingElement.dismiss();
    }
  }

  public async refreshCurrentUser(): Promise<void> {
    const loadingElement = await this.dialogService.showLoading();
    try {
      this.currentUser =
        await this.firebaseAuthenticationService.getCurrentUser();
    } finally {
      await loadingElement.dismiss();
    }
  }

  public async setLanguageCode(languageCode: string): Promise<void> {
    await this.firebaseAuthenticationService.setLanguageCode(languageCode);
  }

  public async useAppLanguage(): Promise<void> {
    await this.firebaseAuthenticationService.useAppLanguage();
  }

  private async navigateToLoginPage(): Promise<void> {
    await this.router.navigate(['/login'], { replaceUrl: true });
  }
  logout(){
    this.as.signOut()
  }
}
