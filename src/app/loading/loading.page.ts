import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  // Function to hide the loading screen
  hideLoadingScreen() {
    this.navCtrl.navigateBack('/home'); // navigate back to the previous page
  }

  // Call the function when your app is ready
  ionViewDidEnter() {
    // Simulating a delay (you should replace this with your actual data loading logic)
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 1500); // Adjust the delay as needed

  }
}
