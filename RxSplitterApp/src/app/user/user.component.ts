import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import jwt_decode from 'jwt-decode';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { AccountsettingService } from '../services/accountsetting.service';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { GroupServiceService } from '../services/group-service.service';
@Component({
  selector: 'user-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  loggedUserVal="";
  loggedUserId="";
  decoded:any=[]
  auth_token : any
  year:number = new Date().getFullYear();
  groupsOfUser=[]

  constructor(private _auth : AuthServiceService, public _service : GroupServiceService,public router : Router, public accountService : AccountsettingService)
  {
    this.auth_token =  JSON.parse(localStorage.getItem('Token') || '{}').value
    this.decoded = jwt_decode(this.auth_token);
    console.log('decodejwt',this.decoded.Name)
    this.loggedUserVal=this.decoded.Name
    this.loggedUserId=this.decoded.Id
    this._service.GetAllGroups().subscribe((res:any)=>{
      this._service.grpList= res.response
      console.log('groups**********',res)
      this.groupsOfUser=res.response.filter(x=>x.isActive==true);
    // this.activeGroups=res.response.filter(x=>x.isActive==true);
    // this.inActiveGroups=res.response.filter(x=>x.isActive==false);
    })

  }

offers:any=[]
offer : any=[]
Checknotification : boolean
@ViewChild(GroupDetailsComponent) GroupDetailsComponent:GroupDetailsComponent;
private hubConnectionBuilder!: HubConnection;
    ngOnInit():void
    { 
      this.accountService.GetUserAccountSettingNotificationChecks().subscribe((res: any) => {
        console.log('GetUserAccountSettingNotificationChecks' ,res.response)
        this.Checknotification = res.response
      })
    
        this.hubConnectionBuilder = new HubConnectionBuilder()
      .withUrl(environment.signalRLink)
      .configureLogging(LogLevel.Information)
      .build();
    this.hubConnectionBuilder
      .start()
      .then(() => 
      {

        var connectionId = this.hubConnectionBuilder.connectionId;
        console.log("Connection ID: " + connectionId);
        console.log('Connection started.......!')
      })
      .catch((err) => console.log('Error while connect with server'));
    this.hubConnectionBuilder.on('SendOffersToUser', (result: any) => {
      this.offers = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
        if (response[i].sentTo == this.loggedUserId && this.Checknotification==true) {
  
          this.offers.push(response[i]);
          this.GroupDetailsComponent.ngOnInit()
          break
        }
      }
      if(this.offers.length >0)
      {
        Swal.fire({
          position: 'bottom-end',
          icon: 'success',
          title:this.offers[0].details,
          showConfirmButton: false,
          timer: 3000
         
        })
      }
        //this.myAccFunc();
       // this.loggedUserVal=this._auth.loggedUser;
        //console.log(this.loggedUserVal);
    })
    this.hubConnectionBuilder.on('SendLeaveToUser', (result: any) => {
      this.offers = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
  
        if (response[i].sentTo == this.loggedUserId && this.Checknotification==true) {
          this.offers.push(response[i]);
          break
        }
      }
      console.log(this.offers[0].details)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.offers[0].details,
        showConfirmButton: false,
        timer: 3000
      })
    });

   
    this.hubConnectionBuilder.on('SendMemberAdd', (result: any) => {
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@',this.loggedUserId );
      this.offer = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
  
        if (response[i].sentTo == this.loggedUserId && this.Checknotification==true) {
          this.offer.push(response[i]);
          break
        }
      }
      console.log(this.offer[0].details)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.offer[0].details,
        showConfirmButton: false,
        timer: 3000
       
      })
    });

    this.hubConnectionBuilder.on('SendSettleUp', (result: any) => {
      console.log('111111111111',this.loggedUserId );
      this.offer = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
  
        if (response[i].sentTo == this.loggedUserId && this.Checknotification==true) {
          this.offer.push(response[i]);
          break
        }
      }
      console.log(this.offer[0].details)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.offer[0].details,
        showConfirmButton: false,
        timer: 3000
       
      })
    });

    this.hubConnectionBuilder.on('AcceptTrans', (result: any) => {
      console.log('22222222222',this.loggedUserId);
      this.offer = [];
      let response = result;
      for (let i = response.length-1; i >=0;  i--) {
  
        if (response[i].sentTo == this.loggedUserId && this.Checknotification==true) {
          this.offer.push(response[i]);
          break
        }
      }
      console.log(this.offer[0].details)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title:this.offer[0].details,
        showConfirmButton: false,
        timer: 3000
       
      })
    });

  }
     

  logout()
  {
   this._auth.removeToken();
   this.router.navigateByUrl("/");
  }

  // Accordion 
  myAccFunc() 
  {
    var x = document.getElementById("demoAcc")!;
    if (x?.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
    } else {
      x.className = x?.className.replace(" w3-show", "");
    }
  }
  
  // Click on the "Jeans" link on page load to open the accordion for demo purposes
  // document.getElementById("myBtn").click();

  // Open and close sidebar
  w3_open() 
  {
    document.getElementById("mySidebar")!.style.display = "block";
    document.getElementById("myOverlay")!.style.display = "block";
  }
   
  w3_close() {
    document.getElementById("mySidebar")!.style.display = "none";
    document.getElementById("myOverlay")!.style.display = "none";
  }


//-------------------------------------------other
openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "270px";
}

closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft= "20px";
}
showGroups(){
  debugger
  if(document.getElementById("showGroups").style.display=="none")
  {
    document.getElementById("showGroups").style.display="block"
  }
  else{
    document.getElementById("showGroups").style.display="none"
  }
}
  
}
