import {Condition} from './condition.model';
import {Persons} from './persons.model'
import {Languages} from './language.model'
import { ypdset,ypdcard } from './ygoprodeck.model';
export class OCR{

    constructor(
        //public id:string = undefined,
        //Identifier
        public language:string | undefined = undefined,
        public card_ID:string | undefined = undefined,
        public konami_ID:string | undefined = undefined


    ){
        //Identifier
        this.language = language,
        this.card_ID= card_ID,
        //COPY INFORMATIONS
        this.konami_ID = konami_ID


    }

}