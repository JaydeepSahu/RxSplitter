import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserLogin } from '../model/user-login';
import { UserRegister } from '../model/user-register';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  GroupName : string='';
  constructor(private _http: HttpClient) { }
  loggedUser=""
  auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${auth_token}'
  });
  link=environment.link
  //link="http://rxsplitterapi.live1.dev.radixweb.net/api/v1/"
  //link="https://localhost:7228/api/v1/" 
  registration(form:UserRegister)
  {
    //
    return this._http.post(this.link+"UserDetail/CreateUser",form)
  }

  login(form:UserLogin)
  {
    return this._http.post(this.link+'Authentication/login',form)
  }
  sendMail(form:any){
    //
    var link=this.link+"Authentication/ForgotPassword?EmailID="+form.userName
    return this._http.get(link)
  }

  isLoggedIn() : boolean
  {
     return localStorage.getItem("Token") ? true : false
  }

  removeToken()
  {
    return localStorage.removeItem("Token")
  }
  
  getEmailByToken(token:string){
  return this._http.get(this.link+'Authentication/GetEmailByToken',{
    headers:new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
  })
  }
  updateNewPassword(password:any,token:string)
  {
    //
    return this._http.post(this.link+'Authentication/ResetPassword/'+password,null,{
      headers:new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    })
    }
}