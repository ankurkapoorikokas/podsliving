import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/service/auth.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/core/constansts';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailForm = new FormGroup({
    username : new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  passwordForm = new FormGroup({
    password : new FormControl('',
   [ Validators.required,
    Validators.minLength(8),
    Validators.maxLength(16)
  ]
    )
  });

  registerForm = new FormGroup({
    title : new FormControl('',
    [Validators.required]
    ),
    firstName : new FormControl("",
      [Validators.required]
    ),
    middleName : new FormControl(""
  ),
    lastName : new FormControl("",
    [Validators.required]
  ),
    phoneNumber: new FormControl("",
    [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
    ),
    userName: new FormControl("",
    [Validators.required, Validators.email]
    ),
    dateOfBirth: new FormControl(""),
    gender: new FormControl("",[Validators.required])
  })
  
 
  blockName: string = "username"; // to check block
  role: any; //store user roles list
  operationType: string; // store operation login/register
  roleSelected: number;
  
  
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService
    ) { }

  ngOnInit(): void {  
  }
  /**
   * used to get username on click of continue button
   * first screen button
   */
  submitUsername(){
    if(!this.emailForm.valid)return
    let formData: FormData = new FormData(); 
    formData.append('email', this.emailForm.value.username);
    this.authService.uploadUser(GlobalConstants.checkemail,formData).subscribe(data=>{
      this.operationType ="register"
      this.blockName = "password"
    },error=>{
      if(error.status === 422){
        this.operationType = "login"
        this.blockName = "password"
      }
      console.log(error.status);
    }
    )
    
  }
  /**
   * used to get password on click ofbutton
   * second screen continue button screen button
   */
  submitPassword(){
    if(!this.passwordForm.valid) return
    let formData: FormData = new FormData();
    if(this.operationType == "login"){
    formData.append('username', this.emailForm.value.username);
    formData.append('password', this.passwordForm.value.password);
      this.authService.uploadUser(GlobalConstants.login,formData).subscribe(data=>{
        if(data){
          console.log(data);
          this.activeModal.close('Close click')      
        }
      })
      
    }else{
      this.authService.getUser(GlobalConstants.getRoles).subscribe(data=>{
        if (data) {
          this.role = data
          this.blockName = "role"
        }
      })  
      
    }
    
  }

  /**
   * getuserRole
   */
  selectUserRole(id:number){
    this.roleSelected = id;
  }
  /**
   * used to submit user role and navigate to next register page
   */
   submitUserRole(){
    if(!this.roleSelected) return
    this.blockName = "registerdetail"
    this.registerForm.patchValue({
      userName: this.emailForm.value.username
    })
   }
}
