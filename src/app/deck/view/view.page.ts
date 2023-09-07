import { Component, OnInit, ViewChild, ElementRef, Input, Output, Renderer2, NgZone, OnDestroy } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { FirebaseCommunicationService } from '../../services/firebase-communication.service';
import { ActionSheetController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';

import { CardDbService } from 'src/app/services/card-db.service';
import { ypdcard, ypdresponse, ypdset, } from 'src/app/models/ygoprodeck.model';
import { AuthService } from '../../services/auth.service';



import { HttpEventType, HttpErrorResponse, HttpClient, } from '@angular/common/http';
import { User } from 'firebase/auth';
import { Subscription } from 'rxjs';




interface YgoDeck {
  uid: string,
  name: string,

  main: SlimCard[],
  extra: SlimCard[],
  side: SlimCard[],
}
interface SlimCard {
  id: string
  name: string,
  type: string,
  image: string
}
interface Card {
  archetype: string,
  atk: number,
  attribute: string,
  card_images: any[]
  card_image: { small: string, full: string }

  def: number,
  desc: string,
  id: string,
  level: number,
  name: string,
  race: string,
  type: string,
}
interface DeckDescription {
  name:string,
  id: string
}

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage implements OnInit {
  public userSub:Subscription
  public folder: string;
  public ygoDeck: YgoDeck
  public cardList: string[]
  public user: User
  public selectedDeck: string
  public userDecks: DeckDescription[] //TO BE CHANGED INTO STRING LIST MANAGED IN USER DATA

  public deckid:string
  constructor(private activatedRoute: ActivatedRoute,
    private fcs: FirebaseCommunicationService,
    public cds: CardDbService,
    public http: HttpClient,
    public auth: AuthService,
    private as: AuthService,
    private ngZone:NgZone) {
    


  }



  ngOnInit() {
    this.deckid = this.activatedRoute.snapshot.paramMap.get('deckid');
    this.userSub = this.as.user$.subscribe(user => {

      this.ngZone.run(() => {
        this.user = user
        this.userDecks = undefined
        this.selectedDeck = undefined
      })
      
      this.setDeck(this.deckid)
      //this.appPages.push({ title: 'My Decks', url: `/deck/${user.uid}`, icon: 'layers' })



    })
  }
  async setDeck(deckid){
    console.log(deckid)
    let deck = await this.fcs.getDeck(deckid)
    console.log(deck.data())
    this.ygoDeck = {
      name:deck.data().name,
      uid:deck.data().uid,
      main:deck.data().main,
      extra:deck.data().extra,
      side:deck.data().side
    }
  }

}
