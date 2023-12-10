import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardFinderPageRoutingModule } from './card-finder-routing.module';

import { CardFinderPage } from './card-finder.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardFinderPageRoutingModule
  ],
  declarations: [CardFinderPage]
})
export class CardFinderPageModule {}
