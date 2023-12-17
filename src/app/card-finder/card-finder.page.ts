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
  card: ypdcard | undefined;
  card2: ypdcard | undefined;
  searchResult : OCR;
  constructor(private sanitizer: DomSanitizer, private cardService: CardOcrService, private cardDB: CardDbService) { }

  ngOnInit() {

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
  this.card = undefined;
  this.card2 = undefined;
  this.searchResult = undefined;
}

/**
 * Processes the result of card search and updates the component properties.
 * @param {OCR} OCRResult - The result of the card search.
 */
private processCardSearchResult(OCRResult: OCR): void {

  if ('card_ID' in OCRResult && OCRResult['card_ID'] !== '') {
    this.cardDB
      .getCardID(OCRResult['card_ID'])
      .toPromise()
      .then((cardDBResult) => {
        console.log(cardDBResult);
        this.card = cardDBResult.data[0];
      })
      .catch((e) => console.log(e));
  }

  if ('konami_ID' in OCRResult && OCRResult['konami_ID'] !== '') {
    this.cardDB
      .getCardFromNum(OCRResult['konami_ID'], OCRResult['language'])
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
