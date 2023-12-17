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
  public getCardID(id:string){
    let url:string = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    console.log(`${url}?konami_id=${id}`)
    let objkt = this.http.get<ypdresponse>(`${url}?konami_id=${id}`)
    console.log('use set info')
    console.log(objkt)
    return objkt
  }
  public getSetFromSetID(setID:string){
    let url:string = 'https://db.ygoprodeck.com/api/v7/cardsetsinfo.php'
    console.log(`${url}?setcode=${setID}`)
    let objkt = this.http.get<ypdset>(`${url}?setcode=${setID}`)
    console.log('use set info')
    console.log(objkt)
    return objkt
  }

  public getCardFromID(number:string,language:string){
    let url:string = 'https://db.ygoprodeck.com/api/v7/cardinfo.php'
    console.log(`${url}?id=${number}&language=${language}`)
    let query = `${url}?id=${number}`
    //if (language == "EN" ){
    //  query = `${url}?id=${number}`
    //}
    let objkt = this.http.get<ypdresponse>(query)
    console.log(objkt)

    return objkt
  }





}
