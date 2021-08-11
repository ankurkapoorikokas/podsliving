import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailForm = new FormGroup({
    username : new FormControl('')
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
    
    this.usernameBlock = false
    this.passwordBlock = true
  }

  getPassword(){
    console.log(this.emailForm.value);
    this.passwordBlock = false;
    this.role = true
  }
}
