import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AccountSetting } from '../model/account-setting';
import { EmailUserSetting } from '../model/EmailUserSetting';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountsettingService {

  constructor(private _http: HttpClient) { }

  auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
 
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_token}`
  });
  link=environment.link
 //link="http://rxsplitterapi.live1.dev.radixweb.net/api/v1/"
//link="https://localhost:7228/api/v1/" 

UpdateUserDetail(accountsetting : AccountSetting)
{
  return this._http.post(this.link+"UserDetail/UpdateUser",accountsetting,
  { headers: this.headers}
  )
 }

 GetUserDetail()
{
  return this._http.get(this.link+"UserDetail/GetUserDetailById",
  { headers: this.headers }
  )
 }


 GetAllEmailType()
{
  return this._http.get(this.link+"UserSetting/GetAllEmailType",
  { headers: this.headers }
  )
 }

 GetAllEmailPeriodType()
 {
   return this._http.get(this.link+"UserSetting/GetAllEmailPeriodType",
   { headers: this.headers }
   )
  }

  GetUserEmailSettingByUserId()
  {
    return this._http.get(this.link+"UserSetting/GetUserEmailSettingByUserId",
    { headers: this.headers }
    )
   }

  GetAllNotificationsType()
  {
    return this._http.get(this.link+"UserSetting/GetAllNotificationsType",
    { headers: this.headers }
    )
   }

 
   GetUserAccountSettingNotificationChecks()
  {
    return this._http.get(this.link+"UserSetting/GetUserAccountSettingNotificationChecks",
    { headers: this.headers }
    )
   }
   
  

   SaveEmailUserSetting(EmailUser:EmailUserSetting)
   {
     return this._http.post(this.link+"UserSetting/EmailUserSetting",JSON.stringify(EmailUser),
     { headers: this.headers }
     )
    }

  
   

}
