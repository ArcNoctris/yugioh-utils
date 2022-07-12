import {Condition} from './condition.model';
import {Persons} from './persons.model'
import {Languages} from './language.model'
import { ypdset,ypdcard } from './ygoprodeck.model';
export class Card{

    constructor(
        //public id:string = undefined,
        //Identifier
        public cardNumber:string | undefined = undefined,
        public setID:string | undefined = undefined,
        //COPY INFORMATIONS
        public condition:Condition = Condition.NM,
        public owner:Persons = Persons.TB,
        public language:Languages = Languages.DE,
        public quantity:number = 1, 
        public price:number = 0.0, //price per copy
        public minPrice:number = 0.0,
        public trendPrice:number = 0.0,
        public note:string='',
        public inserted:boolean = false,
        public multiVersion:boolean = false,
        //API INFO
        public cardInfo:ypdcard | undefined = undefined,
        public setInfo:ypdset | undefined= undefined,
        //BONUS
        //public insertTime:Date = new Date(),
        //public updateTime:Date = insertTime
        public insertTime:string = "",
        public updateTime:string = ""
    ){
        //Identifier
        this.cardNumber = cardNumber,
        this.setID= setID,
        //COPY INFORMATIONS
        this.condition = condition,
        this.owner = owner,
        this.language = language,
        this.quantity = quantity, 
        this.price = price, //price per copy
        this.minPrice = minPrice,
        this.trendPrice = trendPrice,
        this.note = note,
        this.inserted = inserted,
        this.multiVersion = multiVersion,
        //API INFO
        this.cardInfo = cardInfo,
        this.setInfo = setInfo,
        //BONUS
        this.insertTime = insertTime,
        this.updateTime = updateTime

    }

}