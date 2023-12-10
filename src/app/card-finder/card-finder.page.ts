import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-card-finder',
  templateUrl: './card-finder.page.html',
  styleUrls: ['./card-finder.page.scss'],
})
export class CardFinderPage implements OnInit {
  photo: string | undefined | SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
  }
 

takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });

  // image.webPath will contain a path that can be set as an image src.
  // You can access the original file using image.path, which can be
  // passed to the Filesystem API to read the raw data of the image,
  // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.webPath);
  //this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(image.dataUrl) as SafeResourceUrl;
  // Can be set to the src of an image now
  //imageElement.src = imageUrl;
};

}
