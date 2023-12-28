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
