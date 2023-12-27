import { Component, OnInit } from '@angular/core';
import { NavController, NavComponentWithProps } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {



    constructor(private navCtrl: NavController) {}
  
    function1() {
      // Add logic for Function 1

      console.log('Function 1 clicked');
      
    }
  
    function2() {
      // Add logic for Function 2
      console.log('Function 2 clicked');
    }
  
    function3() {
      // Add logic for Function 3
      console.log('Function 3 clicked');
    }
  
    function4() {
      // Add logic for Function 4
      console.log('Function 4 clicked');
    }
  

  ngOnInit() {
  }

}
