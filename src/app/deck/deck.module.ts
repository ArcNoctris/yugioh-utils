import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeckPageRoutingModule } from './deck-routing.module';

import { DeckPage } from './deck.page';
import { FlexLayoutModule } from '@angular/flex-layout';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeckPageRoutingModule,
    FlexLayoutModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideStorage(() => getStorage())
  ],
  declarations: [DeckPage]
})
export class DeckPageModule {}
