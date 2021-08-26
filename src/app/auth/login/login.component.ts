import { Component, OnInit, Input,EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { AuthService } from 'src/app/core/service/auth.service';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalConstants } from 'src/app/core/constansts';
import { isEmpty } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/)
    ])
  });

  passwordForm = new FormGroup({
    password: new FormControl('',
      [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      Validators.pattern(/[$&+,:;=?@#|'<>.^*()%!-]/)
      ]
    )
  });

  otpForm = new FormGroup({
    otp: new FormControl('',
    [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
    ]
    )
  })

  registerForm = new FormGroup({
    title: new FormControl('',
      [Validators.required]
    ),
    firstName: new FormControl("",
      [Validators.required]
    ),
    middleName: new FormControl(""
    ),
    lastName: new FormControl("",
      [Validators.required]
    ),
    phoneNumber: new FormControl("",
      [Validators.required, Validators.maxLength(10), Validators.minLength(10)]
    ),
    userName: new FormControl("",
      [Validators.required, Validators.email]
    ),
    dateOfBirth: new FormGroup({
      day: new FormControl("", [Validators.required]),
      month: new FormControl("", [Validators.required]),
      year: new FormControl("", [Validators.required])
    }),
    gender: new FormControl("", [Validators.required]),
    termsAndCondition: new FormControl("", [Validators.required])
  })

  blockName: string = "username"; // to check block
  role: any; //store user roles list
  operationType: string; // store operation login/register
  roleSelected: number; // stores the roleid after selection in registered as section
  days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 28, 29, 30, 31]
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  years: number[] = [];
  notFocused: boolean = false; // USED IN FIELDS TO CHECK WE FOCUSED OR NOT
  submitted: boolean = false; // flag to deteact current form is submitted
  formData: FormData = new FormData();
  serverError: string
  EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  apiResponse: any;
  hide:boolean=true;


  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.calcYear();
  }
  /**
   * used to get username on click of continue button
   * first screen button
   */
  submitUsername() {
    this.submitted = true;
    if (!this.emailForm.valid) return
    let userName = this.emailForm.value.username
    this.formData.append('username', userName);
    //  * check email is enter or phonenumber is entered
    if (this.EMAIL_REGEX.test(userName)) {
      this.authService.uploadUser(GlobalConstants.checkemail, this.formData).subscribe(data => {
        this.operationType = "register"
      }, error => {
        if (error.status === 422) {
          this.operationType = "log in"  
        } else { alert(error.error.errorMsg); return }
      })
      this.blockName = "password"
      this.submitted = false;
    } else {
      // phone no is entered check existing user or new user
      this.authService.uploadUser(GlobalConstants.login, this.formData).subscribe(data => {
        if (data) {
          this.apiResponse = data;
          this.operationType = "log in"
        }
      }, error => {
        if (error.status === 422) {
          // new user
          this.authService.uploadUser(GlobalConstants.register, this.formData).subscribe(data => {
            if (data) {
              this.apiResponse = data;
              this.operationType = "register"
            }
          })
        } else { alert(error.error.errorMsg); return };
      })
      this.blockName = "oneTimePassword"
      this.submitted = false;
    }
  }

  /**
   * used to get password on click ofbutton
   * second screen continue button screen button
   */
  submitPassword() {
    this.submitted = true;
    if (!this.passwordForm.valid) return
    this.formData.append('username', this.emailForm.value.username);
    this.formData.append('password', this.passwordForm.value.password);
    if (this.operationType == "log in") {
      this.authService.uploadUser(GlobalConstants.login, this.formData).subscribe(data => {
        if (data) {
          this.apiResponse=data
          let token = this.apiResponse.token
          this.activeModal.close(token)
          localStorage.setItem('token', token) 
          this.activeModal.close('Close click')
          this.submitted = false;
        }
      }, error => {
        if (error.status === 422) {
          this.serverError = error.error.errorMsg;
        } else alert(this.serverError);
      })

    } else {
      // this.authService.uploadUser(GlobalConstants.register,this.formData).subscribe(data=>{
      //   if(data){
      //     this.apiResponse=data;
      //     localStorage.setItem('token', this.apiResponse.data.token);
      //   }
      // }, next=>{
      //   this.authService.getUser(GlobalConstants.getRoles).subscribe(data => {
      //     if (data) {
      //       this.role = data
      //       this.blockName = "role"
      //       this.submitted = false;
      //     }
      //   })  
      // })
      forkJoin([
        this.authService.uploadUser(GlobalConstants.register,this.formData),
        this.authService.getUser(GlobalConstants.getRoles)
      ]).subscribe(([data1, data2])=>{
        if(data1){
          this.apiResponse=data1;
          localStorage.setItem('token', this.apiResponse.data.token);
        }
        if(data2){
          this.role = data2
          this.blockName = "role"
          this.submitted = false;
        }
      })
    }

  }

  /**
   * submit otp 
   * if operationType = "log in" then close model and store tokn in local storage
   * else operationType = "register" then navigae further
   */
   submitOtp(){
     this.submitted=true
     if(this.otpForm.invalid)return
     let otpId = this.apiResponse.data.otp_id
     let formData: FormData = new FormData();     
     formData.append("otp_id",otpId)
     formData.append("otp",this.otpForm.value.otp)
    this.authService.uploadUser(GlobalConstants.verifyOtp,formData).subscribe(data=>{
      if(data){
        this.apiResponse = data;
      //  check login or register
    if(this.operationType = "log in"){
      let token = this.apiResponse.data.token
      this.activeModal.close(token)
      localStorage.setItem('token', token)
    }else{
      this.authService.getUser(GlobalConstants.getRoles).subscribe(data => {
        if (data) {
          this.role = data
          this.blockName = "role"
          this.submitted = false;
        }
      })
    }
      }
      
    })
   }

  /**
   * getuserRole
   */
  selectUserRole(id: number) {
    this.roleSelected = id;
  }
  /**
   * used to submit user role and navigate to next register page
   */
  submitUserRole() {
    this.submitted = true;
    if (!this.roleSelected) return
    this.blockName = "registerdetail"
    this.submitted = true
    let userName = this.emailForm.value.username
    // if(EMAIL_REGEX.test(userName))
    this.registerForm.patchValue({
      userName: userName
    })
  }

  /**
   * go to previous page
   */
  previousPage() {
    if (this.blockName === "password" || this.blockName === "oneTimePassword") {
      this.blockName = "username"
    } else if (this.blockName === "role") {
      this.blockName = "password"
    } else if (this.blockName === "registerdetail") {
      this.blockName = "role"
    }
  }
  /**
   * calculate year to current year
   */
  calcYear = () => {
    for (let i: number = new Date().getFullYear(); i > 1949; i--) {
      this.years.push(i);
    }
    return this.years;
  }
}
