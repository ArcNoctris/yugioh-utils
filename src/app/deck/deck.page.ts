import { Component, OnInit, ViewChild, ElementRef, Input, Output, Renderer2 } from '@angular/core';

import { MenuController } from '@ionic/angular';
import { FirebaseCommunicationService } from '../services/firebase-communication.service';
import { ActionSheetController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ActivatedRoute } from '@angular/router';

import { CardDbService } from 'src/app/services/card-db.service';
import { ypdcard, ypdresponse, ypdset, } from 'src/app/models/ygoprodeck.model';
import { AuthService } from '../services/auth.service';

import { UploadingFile } from '../models/uploadingFile.model';


import { HttpEventType, HttpErrorResponse, HttpClient, } from '@angular/common/http';
import { User } from 'firebase/auth';




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
  selector: 'app-folder',
  templateUrl: './deck.page.html',
  styleUrls: ['./deck.page.scss'],
})
export class DeckPage implements OnInit {
  public folder: string;
  public ygoDeck: YgoDeck
  public cardList: string[]
  public user: User
  public selectedDeck: string
  public userDecks: DeckDescription[] //TO BE CHANGED INTO STRING LIST MANAGED IN USER DATA
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  file: UploadingFile;

  constructor(private activatedRoute: ActivatedRoute,
    private fcs: FirebaseCommunicationService,
    public cds: CardDbService,
    public http: HttpClient,
    public auth: AuthService,
    private as: AuthService) {


    as.user$.subscribe(user => {
      this.user = user
      this.userDecks = undefined
      this.selectedDeck = undefined
      // this.fcs.getUserDecks(user.uid).then(q => q.forEach(d => {
      //   if (this.userDecks == undefined) {
      //     this.userDecks = [d.data()]
      //   }
      //   this.userDecks.push(d.data())

      // }))
      this.fcs.getUserDecks(user.uid).then(d => this.userDecks =d)


    })
  }


  // this.cardList = []
  // fcs.listCardImages().then(
  //   list => {
  //     if (list.items.length != 0) {
  //       for (let item of list.items) {
  //         this.cardList.push(item.name)
  //         console.log(item.name)
  //       }
  //     }
  //   })
  // fcs.listCardDocs().then(t => {
  //   if (!t.empty) {
  //     for (let card of t.docs) {
  //       this.cardList.push(card.id)
  //     }

  //   }
  //   console.log(this.cardList)
  // }
  // )


  ngOnInit(): void {
  }

  getFiles() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      if (fileUpload.files.length >= 1) {
        //this.file = new UploadingFile(fileUpload.files[0]);
        this.uploadFiles(fileUpload.files[0]);

      }
      this.fileUpload.nativeElement.value = "";

    };
    fileUpload.click();
  }

  async ydkToJson(file,fileName) {
    let deck: YgoDeck = {
      uid: this.user.uid,
      name: fileName.replace('.ydk',''),
      main: [],
      extra: [],
      side: []
    }
    let ydjJson = { main: [], side: [], extra: [] }
    let regexp = new RegExp('^[0-9]+$')
    console.log(file)
    console.log("fiul")

    const result: string[] = file.split(/\r?\n/);
    //console.log(typeof(result))
    let type = "main"
    for (let line of result) {

      if (line == "#main") {
        type = "main"
      } else if (line == "#extra") {
        type = "extra"
      }
      else if (line == '!side') {
        type = "side"
      }

      else if (regexp.test(line)) {
        let currType = type
        let data = await this.fcs.getCard(line)
        if (data.exists()) {
          console.log("here!?!?!")
          let card = data.data()
          console.log("here")
          console.log(card)
          deck[currType].push({
            id: card.id,
            name: card.name,
            type: card.type,
            image: card.card_image.full
          })
        }
        // if (this.cardList.some((x) => x == line)) {
        //   let data = await this.fcs.getCard(line)
        //   ydjJson[type].push(data.data())


        // }
        else {
          // this.cardList.push(line)
          console.log("was here")
          let ygodbCard = (await this.cds.getCardFromNum(line, "en").toPromise()).data[0]
          console.log(ygodbCard)
          // let card: Card = {
          //   archetype: ygodbCard.archetype,
          //   atk: ygodbCard.atk,
          //   attribute: ygodbCard.attribute,
          //   card_images: [{
          //     id: ygodbCard.card_images[0].id,
          //     image_url: ygodbCard.card_images[0].image_url,
          //     image_url_small: ygodbCard.card_images[0].image_url_small
          //   }],
          //   card_image: { small: ygodbCard.card_images[0].image_url_small, full: ygodbCard.card_images[0].image_url },

          //   def: ygodbCard.def,
          //   desc: ygodbCard.desc,
          //   id: ygodbCard.id,
          //   level: ygodbCard.level,
          //   name: ygodbCard.name,
          //   race: ygodbCard.race,
          //   type: ygodbCard.type,
          // }
          // this.fcs.addCard(line, ygodbCard)
          let image_full = await this.http.get(ygodbCard.card_images[0].image_url, { responseType: 'blob' }).toPromise();
          let image_small = await this.http.get(ygodbCard.card_images[0].image_url_small, { responseType: 'blob' }).toPromise();
          //console.log(image_full)
          await this.fcs.uploadCardPicture(line, image_full, "full")
          await this.fcs.uploadCardPicture(line, image_small, "small")
          let full_url = await this.fcs.getCardImageURL(line, "full")
          let small_url = await this.fcs.getCardImageURL(line, "small")
          ygodbCard['card_image'] = { 'full': full_url, 'small': small_url }
          this.fcs.addCard(line, ygodbCard)
          deck[currType].push({
            id: ygodbCard.id,
            name: ygodbCard.name,
            type: ygodbCard.type,
            image: ygodbCard['card_image'].full
          })
        }

      }

    }
    this.ygoDeck = deck
    this.uploadDeck(deck)

    console.log(this.ygoDeck)
  }
    


  //console.log(this.searchID(ydjJson.main[0]))

  private uploadDeck(ygoDeck:YgoDeck) {
    this.fcs.uploadDeck(ygoDeck)
  //for 
}
  private getUserDecks() {

}
  private uploadFiles(file) {
  if (!file.uploaded) {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {

      console.log(fileReader.result);
      this.ydkToJson(fileReader.result, file.name)
    }

    fileReader.readAsText(file);
    file.inProgress = true;

    file.uploaded = true
    console.log(file)
  }
}
card: ypdcard
searchID(ID: string) {

  this.cds.getCardFromNum(ID, "en").subscribe((e: ypdresponse) => {
    console.log(e)
    this.card = e.data[0]

  })


}
async setDeck(selection){
  console.log(selection)
  let deck = await this.fcs.getDeck(selection.detail.value)
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