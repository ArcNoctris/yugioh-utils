import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardFinderPage } from './card-finder.page';

const routes: Routes = [
  {
    path: '',
    component: CardFinderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardFinderPageRoutingModule {}
