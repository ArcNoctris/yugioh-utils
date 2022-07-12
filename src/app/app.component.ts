import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Play', url: '/play', icon: 'dice' },
    { title: 'Decks', url: '/deck', icon: 'layers' },



  ];
  public user: User
  public labels = ['Travel', 'Reminders'];
  constructor(private as: AuthService) {
    as.user$.subscribe(user => {
      this.user = user
      this.appPages.push({ title: 'My Decks', url: `/deck/${user.uid}`, icon: 'layers' })

    })


  }


}
