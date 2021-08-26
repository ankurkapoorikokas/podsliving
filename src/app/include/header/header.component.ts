import { Component, OnInit } from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/auth/login/login.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private modalService: NgbModal) { }
  

  ngOnInit(): void {
    let token=localStorage.getItem('token');
    if(token){
      this.loginToken=token
    }
  }
  public isMenuCollapsed = true;
  public loginToken: string = "logout";

  /**
   * used to open login model
   */
  open(){
    const modalRef = this.modalService.open(LoginComponent, { windowClass : "myCustomModalClass" });
    modalRef.result.then((result)=>{
      if(result !=="Close click")
      this.loginToken = result;
    })
  }
/**
 * logout
 */
  logout(){
    localStorage.clear();
    this.loginToken="logout";
  }
}
