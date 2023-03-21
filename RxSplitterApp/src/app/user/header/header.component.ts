import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import jwt_decode from 'jwt-decode';
import { AccountsettingService } from 'src/app/services/accountsetting.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { NotificationService } from 'src/app/services/notification.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import {  Input,  ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedUserVal="";
  loggedUserId=""
  offers: any[] = [];
  decoded:any=[]
  auth_token : any
  imageSrc: string;
  length=0
  currentTime:any;
  private hubConnectionBuilder!: HubConnection;

  constructor(private _auth : AuthServiceService, public router : Router, public accountSetting : AccountsettingService, private _noti:NotificationService, private cdr: ChangeDetectorRef)
  {
    this.auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
    this.decoded = jwt_decode(this.auth_token);
    console.log('decodejwt',this.decoded)
    this.loggedUserVal=this.decoded.Name
    this.loggedUserId=this.decoded.Id
    this.currentTime = moment().format();
  }
  page: number = 1;
  ngOnInit(): void {
    this.hubConnectionBuilder = new HubConnectionBuilder()
      //  .withUrl('http://rxsplitterapi.live1.dev.radixweb.net/offers')
       .withUrl(environment.signalRLink)
      //.withUrl('https://localhost:7228/offers')
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => console.log('Connection started.......!'))
      .catch((err) => console.log('Error while connect with server'));
    ;
    this.hubConnectionBuilder.on('sendAllNotifications', (result: any) => {
      console.log('_____________________________');
      this._noti.GetNotificationCount(this.loggedUserId).subscribe((res:any)=>{
        this.length=res
        console.log(res)
      })
      this.GetAllNotifications();
      this.offers = [];
      let response = result;
      for (let i = response.length-1; i >0;  i--) {
        if (response[i].sentTo == this.loggedUserVal) {
          this.offers.push(response[i]);
          break
        }
      }
      console.log(this.offers[0].details)
      Swal.fire({
        position: 'bottom-end',
        icon: 'success',
        title:this.offers[0].details,
        showConfirmButton: false,
        timer: 3000
       
      })
    });
    this.accountSetting.GetUserDetail().subscribe((res: any) => 
    {
      this.imageSrc = res.response[0].profileImage 
    });
    this._noti.GetNotificationCount(this.loggedUserId).subscribe((res:any)=>{
      this.length=res
      console.log(res)
    })
    this.setPeriodicRefresh(1);

    let hamMenu = document.querySelector(".hamburger");
        hamMenu.addEventListener("click", ()=>{
          console.log(hamMenu.classList)
          if(hamMenu.classList.contains('active'))
          {
            hamMenu.classList.toggle("active");
            this.closeNav();
          } 
           else{
            hamMenu.classList.toggle("active");
            this.openNav();
           }

        });

        let winWidth=window.innerWidth;
        console.log("WinWidth:"+winWidth);
        
        if(winWidth<=768)
        {
          hamMenu.classList.toggle("active");
        }
  }
  GetAllNotifications() { 
    this._noti.GetNotification(this.page).subscribe((res:any)=>{
       
      this.offers=[]
      if(this.offers.length>0)
        this.offers.push(...res);
      else
        this.offers=res;
        console.log(this.offers)
      
      this.offers.map(x=>x.time=this.getMinimalisticRelativeTime(x.date));
      // var time = new Date().getTime() - new Date("2013-02-20T12:01:04.753Z").getTime();
      console.log(this.offers)
    })  
  }  
  onScroll() {  
    this.page = this.page + 1;  
    this.GetAllNotifications();  
  }  
  logout()
  {
   this._auth.removeToken();
   this.router.navigateByUrl("/");
  }
  ReadNotification(id:Number){
   // document.getElementById("notification").click()
    this._noti.ReadNotification(id).subscribe((res=>{
      this.GetAllNotifications()
      this._noti.GetNotificationCount(this.loggedUserId).subscribe((res:any)=>{
        this.length=res
        console.log(res)
      })
      document.getElementById("notification").click()

    }))
  }
  clearAll(){
    
    this.offers.forEach(element => {
      console.log(element.id)
      this._noti.ReadNotification(element.id).subscribe((res=>{
        this.GetAllNotifications()
        this._noti.GetNotificationCount(this.loggedUserId).subscribe((res:any)=>{
          this.length=res
          console.log(res)
        })
      
    }))
  })
  }
  getMinimalisticRelativeTime(dateTime) {
    
    if (!dateTime) {
      return null;
    }
  
    const today = moment();
  
    const time = moment(dateTime).add(330, 'm');
    const diff = today.diff(time);
  
    const duration = moment.duration(diff);

    if (duration.years() > 0) {
      return duration.years() + 'y';
    } else if (duration.weeks() > 0) {
      return duration.weeks() + 'w';
    } else if (duration.days() > 0) {
      return duration.days() + 'd';
    } else if (duration.hours() > 0) {
      return duration.hours() + 'h';
    } else if (duration.minutes() > 0) {
      return duration.minutes() + 'm';
    } else if (duration.minutes() < 1) {
      return '1s';
    }
    else{
      return "";
    }
  }
  setPeriodicRefresh(minutes) {
		setInterval(() => {
			this.cdr.markForCheck();
		}, minutes * 10 * 6000);
	}
  // GetNotification(){
  //   this._noti.GetNotification(this.page).subscribe((res:any)=>{
  //     this.offers.push(res);
  //     console.log(res)
  //   })
  // }

openNav() {
  let winWidth=window.innerWidth;
        console.log("WinWidth:"+winWidth);
        document.getElementById("mySidenav").style.width = "180px";
        document.getElementById("mySidenav").style.zIndex = "9";

        if(winWidth<=768)
        {
          document.getElementById("main").style.marginLeft = "0px";
          // document.getElementById("main").style.position = "fixed";
        }else{
          document.getElementById("main").style.marginLeft = "200px";
        }
  
}

closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "20px";
}
}
