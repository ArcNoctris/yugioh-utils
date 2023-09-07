import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user:User
  constructor(private as:AuthService, private ngZone:NgZone){
    as.user$.subscribe(user => {
      this.ngZone.run(() => {
        this.user = user
      })
      
      //this.appPages.push({ title: 'My Decks', url: `/deck/${user.uid}`, icon: 'layers' })

    })
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.user!= undefined){
      return true;
    }
    return false;
  }
  
}
