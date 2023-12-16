import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import {ypdresponse, ypdset} from 'src/app/models/ygoprodeck.model';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Card } from '../models/card.model';
import { idResult } from '../models/upload.model';

@Injectable({
  providedIn: 'root'
})
export class CardDbService {

  constructor(private http: HttpClient) { }
  public getCardFromID(id:string,language:string){
    let url:string = 'https://db.ygoprodeck.com/api/v7/cardsetsinfo.php'
    console.log(`${url}?setcode=${id}`)
    let objkt = this.http.get<ypdset>(`${url}?setcode=${id}`)
    console.log('use set info')
    console.log(objkt)
    return objkt
  }
  public getCardFromNum(number:string,language:string){
    let url:string = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    console.log(`${url}?id=${number}&language=${language}`)
    let query = `${url}?id=${number}&language=${language}`
    //if (language == "EN" ){
    //  query = `${url}?id=${number}`
    //}
    let objkt = this.http.get<ypdresponse>(query)
    console.log(objkt)

    return objkt
  }





}
