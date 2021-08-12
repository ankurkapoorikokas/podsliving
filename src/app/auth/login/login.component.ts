import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailForm = new FormGroup({
    username : new FormControl('', [
      Validators.required
    ])
  });
  
  password = new FormControl('');
  usernameBlock: boolean = true;
  passwordBlock: boolean = false;
  role: boolean=false;
  
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }
  /**
   * used to get username on click of continue button
   * first screen button
   */
  getUsername(){
    console.log(this.emailForm.value);
    this.usernameBlock = false
    this.passwordBlock = true
  }

  getPassword(){
    console.log(this.emailForm.value);
    this.passwordBlock = false;
    this.role = true
  }
}
