import { Injectable } from '@angular/core';
import { Firestore, CollectionReference, collectionData, collection, getDocs, getDoc, addDoc, doc, DocumentData, setDoc, query, where , updateDoc} from '@angular/fire/firestore';
import { FirebaseStorage, Storage, getStorage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { User } from 'firebase/auth';

import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
interface YgoDeck {
  uid: string,
  name: string,

  main: SlimCard[],
  extra: SlimCard[],
  side: SlimCard[],
}
interface SlimCard {
  id: string
  name: string,
  type: string,
  image: string
}
interface Card {
  archetype: string,
  atk: number,
  attribute: string,
  card_images: string[]
  card_image: { small: string, normal: string }

  def: number,
  desc: string,
  id: string,
  level: number,
  name: string,
  race: string,
  type: string,
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseCommunicationService {
  deckCollection: CollectionReference<any>;
  cardCollection: CollectionReference<any>;
  user: User;

  constructor(private afs: Firestore, private db: Storage, private as: AuthService) {
    as.user$.subscribe(user => {
      this.user = user

    })
    this.cardCollection = collection(afs, 'card')
    this.deckCollection = collection(afs, 'deck')
  }

  public getCardCollectionObservable(): Observable<any[]> {
    return collectionData(this.cardCollection)
  }


  async getUserDecks(userId: string) {
    //let deckQuery = query(this.deckCollection, where('uid', "==", userId))

    //return getDocs(deckQuery)
    let docRef = doc(this.afs, 'user', this.user.uid)
    let document = await getDoc(docRef)
    if (document.exists){
      return document.data().decks
    }
    return []

  }
  uploadCardPicture(cardId: string, image: any, type: string) {
    let path = `card/${type}/${cardId}`
    let storage = getStorage(this.db.app)
    let storateReference = ref(storage, path)
    return uploadBytes(storateReference, image)
  }
  getCardImageURL(cardId: string, size: string) {
    let path = `card/${size}/${cardId}`
    let storage = getStorage(this.db.app)
    let storateReference = ref(storage, path)
    return getDownloadURL(storateReference);
  }

  getBackgroundImageURL(orientation: string, id: string) {
    let path = `background/${orientation}/${id}`;
    let storage = getStorage(this.db.app)
    let storateReference = ref(storage, path)
    return getDownloadURL(storateReference);
  }
  listBackgroundImages() {
    let path = `background/normal`;
    let storage = getStorage(this.db.app)
    let storateReference = ref(storage, path)
    return listAll(storateReference)
  }
  // DEPRICATED
  listCardImages() {
    let path = `card/small`;
    let storage = getStorage(this.db.app)
    let storateReference = ref(storage, path)
    return listAll(storateReference)
  }
  // DEPRICATED
  listCardDocs() {
    return getDocs(this.cardCollection);
  }

  addCard(cardNum: string, cardContent: DocumentData) {
    let docRef = doc(this.afs, 'card', cardNum)
    setDoc(docRef, cardContent)

  }
  getCard(cardNum: string) {
    let docRef = doc(this.afs, 'card', cardNum)

    return getDoc(docRef)
  }
  async uploadDeck(deck: YgoDeck) {
    let docRef = await addDoc(this.deckCollection, deck)
    this.addDeckToUser(docRef.id, deck.name)
    
  }
  async addDeckToUser(deckID:string, deckName:string){
    let docRef = doc(this.afs, 'user', this.user.uid)
    let document = await getDoc(docRef)
    let decks = document.data().decks
    decks.push({id:deckID,name:deckName})

    updateDoc(docRef, {decks:decks})
  }
  
  async createUserEntry(){
  let docRef = doc(this.afs, 'user', this.user.uid)
  let user = this.user
  user['decks'] = []
  let document = await getDoc(docRef)
  if(!document.exists){
    setDoc(docRef,user)
  }
  }
  getDeck(deckID){
    let docRef = doc(this.afs, 'deck', deckID)
    return getDoc(docRef)
  }


}
