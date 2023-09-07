import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { DeckPage } from './deck.page';

const routes: Routes = [
  {
    path: '',
    component: DeckPage,


  },
  {
    path: 'viewer',
    loadChildren: () => import('./view/view.module').then(m => m.ViewPageModule)
  },
  {
    path: 'view/:deckid',
    loadChildren: () => import('./view/view.module').then(m => m.ViewPageModule)
  },
  {
    path: 'edit/:deckid',
    loadChildren: () => import('./view/view.module').then(m => m.ViewPageModule)
  }
];

@NgModule({
  imports: [
      RouterModule.forChild(routes)
    ],
  exports: [RouterModule],
})
export class DeckPageRoutingModule { }
