import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardOcrService } from '../services/card-ocr.service';
import { CardDbService } from '../services/card-db.service';
import { ypdset, ypdcard } from '../models/ygoprodeck.model';
import { OCR } from '../models/ocr.model';


@Component({
  selector: 'app-card-finder',
  templateUrl: './card-finder.page.html',
  styleUrls: ['./card-finder.page.scss'],
})
export class CardFinderPage implements OnInit {
  photo: SafeResourceUrl | undefined | string;
  processing: boolean = false;
  card: ypdcard | undefined;
  set: ypdset | undefined;
  searchResult: OCR;
  constructor(private sanitizer: DomSanitizer, private cardService: CardOcrService, private cardDB: CardDbService) { }

  ngOnInit() {
    this.takePicture()
    this.card = { "id": "41165831", "name": "Unchained Soul of Sharvara", "type": "Effect Monster", 
    "desc": "During the Main Phase, if this card is in your hand (Quick Effect): You can target 1 Fiend monster or 1 face-down card you control; destroy it, and if you do, Special Summon this card, but while it is face-up in the Monster Zone, you cannot Special Summon monsters, except Fiend monsters. If this card is sent to the GY: You can Set 1 \"Unchained\" Spell/Trap directly from your Deck. You can only use each effect of \"Unchained Soul of Sharvara\" once per turn.", 
    "atk": 2000, "def": 1500, "level": 6, "race": "Fiend", "attribute": "FIRE", "archetype": "Unchained", 
    "card_sets": [ { "id":"","name":"","set_name": "Duelist Nexus", "set_code": "DUNE-EN019", "set_rarity": "Common", "set_rarity_code": "(C)", "set_price": "0" } ],
     "card_images": [ { "id": "41165831", "image_url": "https://images.ygoprodeck.com/images/cards/41165831.jpg", 
     "image_url_small": "https://images.ygoprodeck.com/images/cards_small/41165831.jpg", "image_url_cropped": "https://images.ygoprodeck.com/images/cards_cropped/41165831.jpg" } ], 
     "card_prices": [ { "cardmarket_price": "0.18", "tcgplayer_price": "0.16", "ebay_price": "0.00", "amazon_price": "0.00", "coolstuffinc_price": "0.39" } ] }
     this.card = undefined;
  }

  /**
    * Takes a picture using the device camera and processes the image.
    * @returns {Promise<SafeResourceUrl>} The web path of the captured image.
    */
  async takePicture(): Promise<SafeResourceUrl> {
    try {
      this.resetData();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
      this.processing = true;

      //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
      this.photo = image.webPath;

      const blob = await fetch(image.webPath!).then((res) => res.blob());
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

      this.searchResult = await this.cardService.searchCard(file);

      this.processCardSearchResult(this.searchResult);
      this.processing = false;
      return this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
    } catch (error) {
      console.error('Error taking picture:', error);
      this.processing = false;
      // Handle error gracefully (show a toast, etc.)
      return '';
    }
  }
  private resetData(): void {
    this.photo = undefined;
    this.card = undefined;
    this.set = undefined;
    this.searchResult = undefined;
  }

  private getCardFromID(id: string, language: string) {
    this.cardDB.getCardFromID(id, language).toPromise()
      .then((cardDBResult) => {
        this.card = cardDBResult.data[0];
      })
      .catch((e) => console.log(e));
  }


  private processCardSearchResult(OCRResult: OCR): void {

    if ('setID' in OCRResult && OCRResult.setID !== '') {
      console.log(OCRResult.setID.replace(OCRResult['language'].toUpperCase(), "EN"))
      console.log("replca")
      OCRResult.setID = OCRResult.setID.replace(OCRResult['language'].toUpperCase(), "EN")
      console.log(OCRResult.setID)
      this.cardDB
        .getSetFromSetID(OCRResult.setID)
        .toPromise()
        .then((cardDBResult) => {
          console.log(cardDBResult);
          this.set = cardDBResult;
          this.getCardFromID(this.set.id, OCRResult.language);
        })
        .catch((e) => {
          console.log(e);
          if ('id' in OCRResult && OCRResult['id'] !== '') {
            this.getCardFromID(OCRResult.id, OCRResult.language);
          }
        });

    } else if ('id' in OCRResult && OCRResult['id'] !== '') {
      this.getCardFromID(OCRResult.id, OCRResult.language);
    }
  }

}
