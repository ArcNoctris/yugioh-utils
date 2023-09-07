import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms'
import { AlertController } from '@ionic/angular';
import { FolderPage } from '../folder/folder.page';
import { FirebaseAuthenticationService } from '../services/firebase-authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  mail:string
  password:string
  registerForm:FormGroup;
  mialFormControll

  constructor(private fb: FormBuilder, private ac:AlertController, private fas: FirebaseAuthenticationService) {
    
    let mailFormControl = new FormControl()
    mailFormControl.setValidators(Validators.required)
    mailFormControl.setValidators(Validators.email)
    let passwordFormControl = new FormControl()
    passwordFormControl.setValidators(Validators.required)
    passwordFormControl.setValidators(Validators.minLength(8))
    let nickFormControl = new FormControl()
    nickFormControl.setValidators(Validators.required)
    nickFormControl.setValidators(Validators.maxLength(12))
    
    this.registerForm = new FormGroup({
      email:mailFormControl,
      password:passwordFormControl,
      nick:nickFormControl
    })
    

   }

  ngOnInit() {
  }
  signInWithGoogle(){
    //TODO
  }
  submitRegistration(){
    console.log(this.registerForm)
    this.fas.signUpWithMail(this.registerForm.value.email,this.registerForm.value.password,this.registerForm.value.nick)
    this.registerForm.reset()
  }
}
