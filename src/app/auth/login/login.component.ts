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
    dateOfBirth: new FormGroup({
      day : new FormControl("", [Validators.required]),
      month: new FormControl("", [Validators.required]),
      year: new FormControl("", [Validators.required])
    }),
    gender: new FormControl("",[Validators.required])
  })
  
 
  blockName: string = "username"; // to check block
  role: any; //store user roles list
  operationType: string; // store operation login/register
  roleSelected: number; // stores the roleid after selection in registered as section
  days=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,26,28,29,30,31]
  months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  years:number[] = [];
  notFocused: boolean = false; // USED IN FIELDS TO CHECK WE FOCUSED OR NOT
  submitted:boolean= false; // flag to deteact current form is submitted



  
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
  submitUsername(){
    this.submitted = true;
    if(!this.emailForm.valid)return
    
    let formData: FormData = new FormData(); 
    formData.append('email', this.emailForm.value.username);
    this.authService.uploadUser(GlobalConstants.checkemail,formData).subscribe(data=>{
      this.operationType ="register"
      this.blockName = "password"
      this.submitted = false;
    },error=>{
      if(error.status === 422){
        this.operationType = "log in"
        this.blockName = "password" 
        this.submitted = false;
      }else{
        alert(error);
      }
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
    if(this.operationType == "log in"){
    formData.append('username', this.emailForm.value.username);
    formData.append('password', this.passwordForm.value.password);
      this.authService.uploadUser(GlobalConstants.login,formData).subscribe(data=>{
        if(data){
          console.log(data);
          this.activeModal.close('Close click')      
        }
      }, error=>{
        alert(error.error.errorMsg);
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

   /**
    * go to previous page
    */
    previousPage(){
      if(this.blockName === "password"){
        this.blockName = "username"
      }else if(this.blockName === "role"){
        this.blockName = "password"
      }else if (this.blockName === "registerdetail"){
        this.blockName = "role"
      }

    }
    /**
     * calculate year to current year
     */
    calcYear = ()=>{
      for(let i:number=new Date().getFullYear(); i> 1949 ; i--){
        this.years.push(i);
      }
      return this.years;
    }
}
