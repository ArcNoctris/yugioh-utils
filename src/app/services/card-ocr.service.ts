import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';

import {ypdresponse, ypdset} from 'src/app/models/ygoprodeck.model';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Card } from '../models/card.model';
import { idResult } from '../models/upload.model';
import { OCR} from '../models/ocr.model';
//import { CapacitorHttp  } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class CardOcrService {

  constructor(private http: HttpClient) { }
  public searchCard(image:File){
    let url:string = 'https://arcnoctris-deckdojo.hf.space/process_image'
    const formData: FormData = new FormData();
    formData.append('file', image, image.name);


    

    let objkt = this.http.post<OCR>(url, formData).toPromise();
    //console.log(`${url}?setcode=${id}`)
    //let objkt = this.http.get<ypdset>(`${url}?setcode=${id}`)
    console.log('use set info')

    //console.log(objkt['__zone_symbol__value'])
    return objkt
 
  }

  //uploadPhoto(photoData: string): Observable<any> {
    // Assuming your API expects a POST request with the photo data
  //  return this.http.post(this.apiUrl, { photoData });
  //}





}
