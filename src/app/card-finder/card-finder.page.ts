import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CardOcrService } from '../services/card-ocr.service';
import { CardDbService } from '../services/card-db.service';
import { ypdset, ypdcard } from '../models/ygoprodeck.model';
import { OCR} from '../models/ocr.model';

@Component({
  selector: 'app-card-finder',
  templateUrl: './card-finder.page.html',
  styleUrls: ['./card-finder.page.scss'],
})
export class CardFinderPage implements OnInit {
  photo: SafeResourceUrl | undefined | string;
  processing: boolean = false;
  jso;
  card: ypdcard;
  card2: ypdcard;
  searchResult : OCR;
  constructor(private sanitizer: DomSanitizer, private cardService: CardOcrService, private cardDB: CardDbService) { }

  ngOnInit() {

  }

 /**
   * Takes a picture using the device camera and processes the image.
   * @returns {Promise<string>} The web path of the captured image.
   */
 async takePicture(): Promise<SafeResourceUrl> {
  try {
    this.resetData();

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
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
  this.jso = undefined;
  this.card = undefined;
  this.card2 = undefined;
  this.searchResult = undefined;
}

/**
 * Processes the result of card search and updates the component properties.
 * @param {any} result - The result of the card search.
 */
private processCardSearchResult(result: any): void {
  this.jso = result;

  //if ('card_ID' in result && result['card_ID'] !== '') {
  //  this.cardDB
  //    .getCardFromID(result['card_ID'])
  //    .toPromise()
  //    .then((cardDBResult) => {
  //      console.log(cardDBResult);
  //      this.card2 = cardDBResult.data[0];
  //    })
  //    .catch((e) => console.log(e));
  //}

  if ('konami_ID' in result && result['konami_ID'] !== '') {
    this.cardDB
      .getCardFromNum(result['konami_ID'], result['language'])
      .toPromise()
      .then((cardDBResult) => {
        console.log("Data")
        for (let dat in cardDBResult.data){
          console.log(dat)
        }
        //console.log(cardDBResult.data[0]);
        this.card = cardDBResult.data[0];
      })
      .catch((e) => console.log(e));
  }
}

}
