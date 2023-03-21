import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _http: HttpClient) { }
   
  grpList: any
  
  auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.auth_token}`
  });

// link="http://rxsplitterapi.live1.dev.radixweb.net/api/v1/"
link=environment.link

// link="https://localhost:7228/api/v1/"

GetNotification(page:number)
{
   return this._http.post(this.link+"Notifications/getAllNotification/"+page,"",{
   headers: this.headers
   })
 }
 GetNotificationCount(userId:string)
 {
  return this._http.get(this.link+"Notifications/notificationcount?userId="+userId,{
    headers: this.headers
  })
 }
ReadNotification(id:Number)
{
return this._http.get(this.link+"Notifications/ReadNotification?id="+id,{
  headers: this.headers
})
//  https://localhost:7228/api/v1/Notifications/ReadNotification?id=326

}
}