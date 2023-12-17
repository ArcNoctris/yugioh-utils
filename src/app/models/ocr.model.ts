import {Condition} from './condition.model';
import {Persons} from './persons.model'
import {Languages} from './language.model'
import { ypdset,ypdcard } from './ygoprodeck.model';
export class OCR{

    constructor(
        //public id:string = undefined,
        //Identifier
        public language:string | undefined = undefined,
        public setID:string | undefined = undefined,
        public id:string | undefined = undefined


    ){
        //Identifier
        this.language = language,
        this.setID= setID,
        this.id = id


    }

}