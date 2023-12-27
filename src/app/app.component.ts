import { Component, NgZone, OnInit,OnDestroy } from '@angular/core';
import { User } from 'firebase/auth';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { LoadingPage } from './loading/loading.page';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public userSub:Subscription
  public appPages = [
    { title: 'Play', url: '/play', icon: 'dice' },
    { title: 'Decks', url: '/deck', icon: 'layers' },
    { title: 'Card Finder', url: '/card-finder', icon: 'scan-circle' },



  ];
  public user: User
  public labels = ['Travel', 'Reminders'];
  constructor(private as: AuthService, private ngZone: NgZone,private navCtrl: NavController) {




  }
  // Function to show the loading screen
showLoadingScreen() {
  this.navCtrl.navigateForward('/loading');
}

// Call the function when needed
ionViewDidEnter() {
  this.showLoadingScreen();
}


  ngOnInit(){
    this.userSub = this.as.user$.subscribe(user => {
      this.ngZone.run(() => {
        this.user = user
      })
      
      //this.appPages.push({ title: 'My Decks', url: `/deck/${user.uid}`, icon: 'layers' })

    })
   
  }
  ngOnDestroy(){
    this.userSub.unsubscribe()
  }

}
