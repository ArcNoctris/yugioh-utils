import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {CardOcrService} from '../services/card-ocr.service';
import {CardDbService} from '../services/card-db.service';
import { ypdset, ypdcard } from '../models/ygoprodeck.model';

@Component({
  selector: 'app-card-finder',
  templateUrl: './card-finder.page.html',
  styleUrls: ['./card-finder.page.scss'],
})
export class CardFinderPage implements OnInit {
  photo: string | undefined | SafeResourceUrl;
  jso;
  card: ypdcard;
  card2: ypdset;
  constructor(private sanitizer: DomSanitizer,private cardService:CardOcrService, private cardDB:CardDbService) {}

  ngOnInit() {
   
  }
 

  async takePicture(): Promise<string>  {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    var resu = this.cardService.hw().toPromise();
    console.log(resu.toString())
    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);

    fetch(image.webPath!)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      this.cardService.searchCard(file).then((re) => {
        console.log(re)
        this.jso = re
        if ('card_ID' in re && re['card_ID'] != ""){
          this.cardDB.getCardFromID(re['card_ID'],'en').toPromise().then((cardDBResult) => {console.log(cardDBResult)
            this.card2 = cardDBResult}).catch((e)=>console.log(e))
        }
        if ('konami_ID' in re && re['konami_ID'] != ""){
          this.cardDB.getCardFromNum(re['konami_ID'],re['language']).toPromise().then((cardDBResult) => {console.log(cardDBResult.data[0])
            this.card = cardDBResult.data[0]}).catch((e)=>console.log(e))
        }
      })
      
    })

    //var res = await this.cardService.searchCard(image.webPath,'en').toPromise();
    //console.log(res.toString())
    return image.webPath;
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    
    //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.dataUrl) as SafeResourceUrl;
    // Can be set to the src of an image now
    //imageElement.src = imageUrl;
  };

}
