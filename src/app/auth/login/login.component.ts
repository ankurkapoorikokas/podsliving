import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = new FormControl('');
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
    this.passwordBlock = false;
    this.role = true
  }
}
