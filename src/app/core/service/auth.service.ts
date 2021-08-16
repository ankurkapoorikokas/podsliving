import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Observable ,  BehaviorSubject ,  ReplaySubject } from 'rxjs';
import { map ,  distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { 
  }

  /**
   * used to check users/loginuser
   * 
   * params url, data
   * 
   */
uploadUser(url : string, data: any):Observable<{}>{
  return this.http.post(`${environment.apiUrl}${url}`,data);
}

getUser(url:string):Observable<{}>{
  return this.http.get(`${environment.apiUrl}${url}`);
}

}



